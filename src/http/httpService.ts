import { RxJSHttpClient } from "rxjs-http-client";
import config from "../config/config";
import { authenticationQuery } from "../shared/authentication/state";
import { TokenInterceptor } from "./tokenInterceptor";

export class HttpClientService {
  static instance: HttpClientService | null = null;

  static getInstance(): HttpClientService {
    if (HttpClientService.instance === null) {
      HttpClientService.instance = new HttpClientService();
    }
    return HttpClientService.instance;
  }

  httpClient: RxJSHttpClient = new RxJSHttpClient([
    new TokenInterceptor(
      () => authenticationQuery.accessToken,
      false,
      config.backendUrl
    ),
  ]);

  private constructor() {}
}
