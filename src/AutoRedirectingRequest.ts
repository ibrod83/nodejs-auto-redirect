import { Writable } from "stream"
import { CustomIncomingMessage, RequestCallback, RequestOptions, WriteMethodCallback } from "./types"
import { shouldRedirect } from "./utils/redirect"
import { extractOptionsFromURLObject, terminateRequest } from "./utils/request"
import originalHttp, { ClientRequest, IncomingMessage } from 'http'
import originalHttps from 'https'

export default class AutoRedirectingRequest extends Writable {

    private _currentRequest!: ClientRequest//Holds the current request.
    private _eventListenerDictionary: { [index: string | symbol]: Array<(...args: any[]) => void> } = {}//Store a reference to all registered event handlers,
    // to be re-registered in subsequent requests.
    private _setTimeout?: [number, (() => void) | undefined]//Store a reference to a timeout handler.
    private _postRequestBuffering: Array<{ chunk: any, encoding?: BufferEncoding }> = []
    private _endPromise: Promise<void>;
    private _endResolve!: Function;
    public numRedirects: number = 0


    constructor(options: RequestOptions, callback?: RequestCallback) {
        super()
        this._endPromise = new Promise((res) => this._endResolve = res)
        this._currentRequest = this._createRequest(options, callback)
    }


    private _createRequest(options: RequestOptions, callback?: RequestCallback) {
        const httpModule = options.protocol === 'http:' ? originalHttp : originalHttps
        const request = httpModule.request(options, (response) => {
            this._processResponse(response, options, callback)
        })
        return request
    }

    private async _createRedirect(options: RequestOptions, callback?: RequestCallback) {
        console.log('creating redirect')
        const request = this._createRequest({ ...options }, callback)
        this._currentRequest = request;
        await this._endPromise
        for (const bufferingItem of this._postRequestBuffering) {//
            const { chunk, encoding } = bufferingItem
            const result = await new Promise<Error | null | undefined>(res => encoding ? request.write(chunk, encoding, res) : request.write(chunk, res))

        }

        this._reRegisterEventListeners()
        if (this._setTimeout) request.setTimeout(...this._setTimeout)
        request.end()//

    }


    private _processResponse(response: IncomingMessage, options: RequestOptions, callback?: RequestCallback) {
        const shouldBeRedirected = shouldRedirect(response.statusCode as number)//Inquire: statusCode not always available
        if (shouldBeRedirected) {//
            this._handleTransientResponse(response, options, callback)
        } else {
            this._handleFinalResponse(response, callback)
        }
    }

    private async _handleTransientResponse(response: IncomingMessage, options: RequestOptions, callback?: RequestCallback) {
        this.numRedirects++

        terminateRequest(this._currentRequest)

        const url = new URL(response.headers.location as string)//Take care of other scenarios.

        const extractedOptionsFromURL = extractOptionsFromURLObject(url as URL)

        this._createRedirect({ ...options, ...extractedOptionsFromURL }, callback)

    }

    private _reRegisterEventListeners() {
        for (const eventName in this._eventListenerDictionary) {
            for (const cb of this._eventListenerDictionary[eventName]) {
                this._currentRequest.on(eventName, cb)
            }
        }
    }

    private async _handleFinalResponse(response: IncomingMessage, callback?: RequestCallback) {
        //@ts-ignore
        response.numRedirects = this.numRedirects
        callback && callback(response as CustomIncomingMessage)
    }


    //@ts-ignore
    end(cb?: () => void) {
        // this._endWasCalled = true
        this._endResolve();
        return this._currentRequest.end(cb);
    }

    setTimeout(mil: number, callback?: () => void) {
        this._setTimeout = [mil, callback]
        // throw new Error('setTimeout is not supported. Use the "timeout" property in the request config instead')
        this._currentRequest.setTimeout(mil, callback)
    }

    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        super.on(eventName, listener)
        if (!this._eventListenerDictionary[eventName]) {//
            this._eventListenerDictionary[eventName] = [listener]
        } else {
            this._eventListenerDictionary[eventName].push(listener)
        }
        this._currentRequest.on(eventName, listener)
        return this;
    }

    write(chunk: any, callback?: WriteMethodCallback): boolean;
    write(chunk: any, encoding: BufferEncoding, callback?: WriteMethodCallback): boolean;

    write(chunk: any, arg2?: BufferEncoding | WriteMethodCallback, arg3?: (error: Error | null | undefined) => void): boolean {

        let callback;
        let encoding;
        if (typeof arg2 === 'function') {
            callback = arg2
        } else {
            encoding = arg2;
            callback = arg3
        }
        this._postRequestBuffering.push({ chunk, encoding });
        callback && callback(undefined)
        // if (encoding) return this._currentRequest.write(chunk, encoding, callback)// 
        // if(!this._endWasCalled){
        //   return this._currentRequest.write(chunk, callback)//   
        // }
        return false
        // return false;
    }


}




  // const originalRequest = this._currentRequest = this._createRequest(options, callback)

        // originalRequest.on('end',(arg)=>{
        //     console.log('end event',arg)
        // })
        // originalRequest.on('abort',(arg:any)=>{
        //     console.log('abort event',arg)
        // })
        // originalRequest.on('close',(arg:any)=>{
        //     console.log('close event',arg)
        // })
        // originalRequest.on('error',(arg:any)=>{
        //     // if(originalRequest){}
        //     console.log('error event',arg)
        // })
        // originalRequest.on('finish',(arg:any)=>{
        //     console.log('finish event',arg)
        // })

        // this._currentRequest.on('drain',(arg:any)=>{
        //     console.log('drain event',arg)
        // })