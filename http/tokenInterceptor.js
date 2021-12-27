"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInterceptor = void 0;
/**
 * TokenInterceptor.
 * @implements {IHttpInterceptor<HttpRequest>}
 *
 * Meant to be able to resolve a token for a certain backend
 */
class TokenInterceptor {
    /**
     * @param tokenResolution - function that returns a token
     * @param strict - when true checks also the path not only the hostname
     * @param backendUrls - which urls applies for the given token
     */
    constructor(tokenResolution, strict = false, ...backendUrls) {
        this.backendUrls = backendUrls;
        this.strict = strict;
        this.tokenResolution = tokenResolution;
    }
    intercept(data) {
        const clone = data.clone();
        if (this.isConfiguredUrl(clone.url)) {
            clone.headers["Authorization"] = `Bearer ${this.tokenResolution()}`;
        }
        return clone;
    }
    isConfiguredUrl(url) {
        // Strict checks if we hae a match for the beginning of the URL
        if (this.strict) {
            for (const backend of this.backendUrls) {
                if (url.startsWith(backend)) {
                    return true;
                }
                return false;
            }
        }
        const parsedUrl = new URL(url);
        const complete = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
        return this.backendUrls.some((item) => item === complete);
    }
}
exports.TokenInterceptor = TokenInterceptor;
//# sourceMappingURL=tokenInterceptor.js.map