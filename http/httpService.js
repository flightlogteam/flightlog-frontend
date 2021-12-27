"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientService = void 0;
const rxjs_http_client_1 = require("rxjs-http-client");
class HttpClientService {
    constructor() {
        this.httpClient = new rxjs_http_client_1.RxJSHttpClient([
        /*new TokenInterceptor(
          () => authenticationQuery.accessToken,
          false,
          config.backendUrl
        ),*/
        ]);
    }
    static getInstance() {
        if (HttpClientService.instance === null) {
            HttpClientService.instance = new HttpClientService();
        }
        return HttpClientService.instance;
    }
}
exports.HttpClientService = HttpClientService;
HttpClientService.instance = null;
//# sourceMappingURL=httpService.js.map