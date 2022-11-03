"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const redirect_1 = require("./utils/redirect");
const request_1 = require("./utils/request");
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
class AutoRedirectingRequest extends stream_1.Writable {
    constructor(options, callback) {
        super();
        this._callback = callback;
        this._options = options; //
    }
    _startRequest(options, callback) {
        const httpModule = options.protocol === 'http:' ? http_1.default : https_1.default;
        this._currentRequest = httpModule.request(options, (response) => {
            this._processResponse(response, options, callback);
        });
        if (options.timeout) {
            this._currentRequest.on('timeout', () => {
                this.emit('timeout');
            });
        }
        this._currentRequest.end(); //
    }
    _processResponse(response, options, callback) {
        const shouldBeRedirected = (0, redirect_1.shouldRedirect)(response.statusCode); //Inquire: statusCode not always available
        if (shouldBeRedirected) {
            (0, request_1.terminateRequest)(this._currentRequest);
            const url = new URL(response.headers.location); //Take care of other scenarios.
            const extractedOptionsFromURL = (0, request_1.extractOptionsFromURLObject)(url);
            this._startRequest(Object.assign(Object.assign({}, options), extractedOptionsFromURL), callback);
        }
        else {
            callback && callback(response);
        }
    }
    end(cb) {
        this._startRequest(this._options, this._callback);
        return this;
    }
}
exports.default = AutoRedirectingRequest;
