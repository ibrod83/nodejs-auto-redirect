import { ClientRequestArgs, IncomingMessage } from "http";

export interface RequestOptions extends ClientRequestArgs { }

export type RequestCallback = (res: IncomingMessage) => void
