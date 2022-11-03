import { ClientRequest } from "http";
import { RequestOptions } from "../types";

export function terminateRequest(request:ClientRequest){
    const majorNodeVersion = parseInt(process.versions.node.split('.')[0]);
        if (!majorNodeVersion || majorNodeVersion < 14) {
            request.abort()

        } else {
            request.destroy()
        }
}

export function isRequestOptionsObject(arg: any): boolean {
    if (typeof arg !== 'object' || arg instanceof URL) return false;

    return true;
}


export function extractOptionsFromURLObject(url:URL):Partial<RequestOptions>{
    const query = url.search

    return  { path: query.length ? url?.pathname+query : url?.pathname, host: url?.host, hostname: url?.hostname, protocol: url?.protocol as string, port: url?.port}
}