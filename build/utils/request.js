"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractOptionsFromURLObject = exports.isRequestOptionsObject = exports.terminateRequest = void 0;
function terminateRequest(request) {
    const majorNodeVersion = parseInt(process.versions.node.split('.')[0]);
    if (!majorNodeVersion || majorNodeVersion < 14) {
        request.abort();
    }
    else {
        request.destroy();
    }
}
exports.terminateRequest = terminateRequest;
function isRequestOptionsObject(arg) {
    if (typeof arg !== 'object' || arg instanceof URL)
        return false;
    return true;
}
exports.isRequestOptionsObject = isRequestOptionsObject;
function extractOptionsFromURLObject(url) {
    return { path: url === null || url === void 0 ? void 0 : url.pathname, host: url === null || url === void 0 ? void 0 : url.host, hostname: url === null || url === void 0 ? void 0 : url.hostname, protocol: url === null || url === void 0 ? void 0 : url.protocol, port: url === null || url === void 0 ? void 0 : url.port };
}
exports.extractOptionsFromURLObject = extractOptionsFromURLObject;
