import { ClientRequestArgs, IncomingMessage } from "http";

export interface RequestOptions extends ClientRequestArgs { }

export type RequestCallback = (res: CustomIncomingMessage) => void

export interface CustomIncomingMessage extends IncomingMessage{
    numRedirects:number
}

export type WriteMethodCallback = ((error: Error | null | undefined) => void)