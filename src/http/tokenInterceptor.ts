import { IHttpInterceptor } from "rxjs-http-client/types/http-interceptor.interface";
import { HttpRequest } from "rxjs-http-client/types/http-request.class";

/**
 * TokenInterceptor.
 * @implements {IHttpInterceptor<HttpRequest>}
 *
 * Meant to be able to resolve a token for a certain backend
 */
export class TokenInterceptor implements IHttpInterceptor<HttpRequest> {
  tokenResolution: () => string;
  backendUrls: string[];
  strict: boolean;

  /**
   * @param tokenResolution - function that returns a token
   * @param strict - when true checks also the path not only the hostname
   * @param backendUrls - which urls applies for the given token
   */
  constructor(
    tokenResolution: () => string,
    strict = false,
    ...backendUrls: string[]
  ) {
    this.backendUrls = backendUrls;
    this.strict = strict;
    this.tokenResolution = tokenResolution;
  }

  intercept(data: HttpRequest): HttpRequest {
    const clone = data.clone();
    if (this.isConfiguredUrl(clone.url)) {
      clone.headers["Authorization"] = `Bearer ${this.tokenResolution()}`;
    }

    return clone;
  }

  private isConfiguredUrl(url: string): boolean {
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
