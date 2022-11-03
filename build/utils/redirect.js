"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRedirect = exports.redirectionHeaders = void 0;
exports.redirectionHeaders = [301, 302, 308];
function shouldRedirect(statusCode) {
    return exports.redirectionHeaders.includes(statusCode);
}
exports.shouldRedirect = shouldRedirect;
