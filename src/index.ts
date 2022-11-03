import { extractOptionsFromURLObject, isRequestOptionsObject } from './utils/request'
import { RequestCallback, RequestOptions } from './types'
import AutoRedirectingRequest from './AutoRedirectingRequest'

//The two possible overloads, consistent with the original API.
function request(options: RequestOptions | string | URL, callback?: RequestCallback): AutoRedirectingRequest
function request(
    url: string | URL,
    options: RequestOptions,
    callback?: RequestCallback,
): AutoRedirectingRequest

function request(arg1: RequestOptions | string | URL, arg2?: RequestOptions | RequestCallback, callback?: RequestCallback) {

    let url: URL | undefined;
    if (typeof arg1 === 'string') {
        url = new URL(arg1)
    } else if (arg1 instanceof URL) {
        url = arg1
    }
    const args = Array.from(arguments)

    let requestOptions: Partial<RequestOptions> = args.find(arg => isRequestOptionsObject(arg)) || {}
    const normalizedCallback: RequestCallback = args.find(arg => typeof arg === 'function')

    // requestOptions = { path: url?.pathname, host: url?.host, hostname: url?.hostname, protocol: url?.protocol as string, port: url?.port, ...requestOptions }
    requestOptions = { ...extractOptionsFromURLObject(url as URL), ...requestOptions }
    //
    return new AutoRedirectingRequest(requestOptions, normalizedCallback)

}


export const http = {
    request
}
export const https = {
    request
}


