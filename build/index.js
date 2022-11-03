"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.https = exports.http = void 0;
const request_1 = require("./utils/request");
const AutoRedirectingRequest_1 = __importDefault(require("./AutoRedirectingRequest"));
function request(arg1, arg2, callback) {
    let url;
    if (typeof arg1 === 'string') {
        url = new URL(arg1);
    }
    else if (arg1 instanceof URL) {
        url = arg1;
    }
    const args = Array.from(arguments);
    let requestOptions = args.find(arg => (0, request_1.isRequestOptionsObject)(arg)) || {};
    const normalizedCallback = args.find(arg => typeof arg === 'function');
    // requestOptions = { path: url?.pathname, host: url?.host, hostname: url?.hostname, protocol: url?.protocol as string, port: url?.port, ...requestOptions }
    requestOptions = Object.assign(Object.assign({}, (0, request_1.extractOptionsFromURLObject)(url)), requestOptions);
    //
    return new AutoRedirectingRequest_1.default(requestOptions, normalizedCallback);
}
exports.http = {
    request
};
exports.https = {
    request
};
