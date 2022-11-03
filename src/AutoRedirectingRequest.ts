import { EventEmitter, Writable } from "stream"
import { CustomIncomingMessage, RequestCallback, RequestOptions } from "./types"
import { shouldRedirect } from "./utils/redirect"
import { extractOptionsFromURLObject, terminateRequest } from "./utils/request"
import originalHttp, { ClientRequest, IncomingMessage } from 'http'
import originalHttps from 'https'

export default class AutoRedirectingRequest extends EventEmitter {


    private _currentRequest!: ClientRequest//Holds the current request.
    private _eventListenerDictionary:{[index:string|symbol]:Array<(...args: any[])=>void>}={}//Store a reference to all registered event handlers,
    // to be re-registered in subsequent requests.
    private _setTimeout?:[number,(()=>void)|undefined]//Store a reference to a timeout handler.


    public numRedirects: number = 0//

    constructor(options: RequestOptions, callback?: RequestCallback) {
        super()
        this._currentRequest = this._createRequest(options,callback)


    }

    private _createRequest(options: RequestOptions, callback?: RequestCallback) {
        const httpModule = options.protocol === 'http:' ? originalHttp : originalHttps
        const request = httpModule.request(options, (response) => {
            this._processResponse(response, options, callback)
        })
        return request
    }
   
    private _processResponse(response: IncomingMessage, options: RequestOptions, callback?: RequestCallback) {
        const shouldBeRedirected = shouldRedirect(response.statusCode as number)//Inquire: statusCode not always available
        if (shouldBeRedirected) {//
            this._handleTransientResponse(response,options,callback)
        } else {
            this._handleFinalResponse(response,callback)
        }
    }

    private _handleTransientResponse(response: IncomingMessage, options: RequestOptions, callback?: RequestCallback) {
        this.numRedirects++
        // response.
        terminateRequest(this._currentRequest)
        const url = new URL(response.headers.location as string)//Take care of other scenarios.
        const extractedOptionsFromURL = extractOptionsFromURLObject(url as URL)
        const newRequest = this._createRequest({ ...options, ...extractedOptionsFromURL }, callback)
        this._currentRequest = newRequest
        this._reRegisterEventListeners()
        if(this._setTimeout)newRequest.setTimeout(...this._setTimeout)
        newRequest.end()
    }

    private _reRegisterEventListeners(){
        for(const eventName in this._eventListenerDictionary){
            for(const callback of this._eventListenerDictionary[eventName]){
                this._currentRequest.on(eventName,callback)
            }
        }
    }

    private _handleFinalResponse(response: IncomingMessage, callback?: RequestCallback) {
        //@ts-ignore
        response.numRedirects = this.numRedirects

        callback && callback(response as CustomIncomingMessage)
    }

    end(cb?: () => void): this {
        this._currentRequest.end(cb);
        return this
    }

    setTimeout(mil:number,callback?:()=>void) {
        this._setTimeout = [mil,callback]
        // throw new Error('setTimeout is not supported. Use the "timeout" property in the request config instead')
        this._currentRequest.setTimeout(mil,callback)
    }

    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        super.on(eventName,listener)
        if(!this._eventListenerDictionary[eventName]){
            this._eventListenerDictionary[eventName] = [listener]
        }else{
            this._eventListenerDictionary[eventName].push(listener)
        }
        this._currentRequest.on(eventName,listener)
        return this;
    }


}
