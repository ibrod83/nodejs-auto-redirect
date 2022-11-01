import { Writable } from "stream"
import { RequestCallback, RequestOptions } from "./types"
import { shouldRedirect } from "./utils/redirect"
import { extractOptionsFromURLObject, terminateRequest } from "./utils/request"
import originalHttp, { ClientRequest, IncomingMessage} from 'http'
import originalHttps from 'https'

export default class AutoRedirectingRequest extends Writable {

    private _options: RequestOptions
    private _currentRequest!: ClientRequest
    private _callback!: RequestCallback | undefined

    constructor(options: RequestOptions, callback?: RequestCallback) {
        super()
        this._callback = callback
        this._options = options//
    }

    private _startRequest(options: RequestOptions, callback?: RequestCallback) {
        const httpModule = options.protocol === 'http:' ? originalHttp : originalHttps
        this._currentRequest = httpModule.request(options, (response) => {
            this._processResponse(response,options,callback)
        })
        this._currentRequest.end()//
    }

    private _processResponse(response:IncomingMessage,options:RequestOptions,callback?:RequestCallback){
        const shouldBeRedirected = shouldRedirect(response.statusCode as number)//Inquire: statusCode not always available
            if (shouldBeRedirected) {
                terminateRequest(this._currentRequest)
                const url = new URL(response.headers.location as string)//Take care of other scenarios.
                const extractedOptionsFromURL = extractOptionsFromURLObject(url as URL)
                this._startRequest({ ...options, ...extractedOptionsFromURL },callback)
            } else {
                callback && callback(response)
            }
    }   

    end(cb?: () => void): this {
        this._startRequest(this._options, this._callback);
        return this
    }

}
