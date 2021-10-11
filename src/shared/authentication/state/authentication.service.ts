import Sdk from "casdoor-js-sdk/lib/cjs/sdk";
import { from, mergeMap, Observable, of, tap } from "rxjs";
import config from "../../../config/config";
import { configQuery, ConfigQuery } from "../../config/state";
import {
  AuthenticationStore,
  authenticationStore,
} from "./authentication.store";

const TOKEN_STORAGE = "access_token";

interface TokenPersistance {
  refreshToken: string;
  accessToken: string;
}

export class AuthenticationService {
  constructor(private authenticationStore: AuthenticationStore, private config: ConfigQuery) {
    this.loadTokenFromStorage();

  }

  isTokenExpired(token: string): boolean {
    if (token.length > 0) {
      const tokenData = atob(token.split(".")[1]);

      const tokenContent = JSON.parse(tokenData) as {
        exp: number;
      };

      return tokenContent.exp * 1000 < Date.now();
    }

    return true;
  }

  async login(userIdentifier: string, password: string): Promise<void> {
    this.authenticationStore.setLoading(true);
    let email = "";
    let username = "";

    if (userIdentifier.includes("@")) {
      email = userIdentifier;
    } else {
      username = userIdentifier;
    }

    const response = await fetch(`${config.backendUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    const data = (await response.json()) as {
      data: { AccessToken: string; RefreshToken: string };
    };

    this.authenticationStore.setTokens(
      data.data.AccessToken,
      data.data.RefreshToken
    );

    sessionStorage.setItem(
      TOKEN_STORAGE,
      JSON.stringify({
        accessToken: data.data.AccessToken,
        refreshToken: data.data.RefreshToken,
      })
    );

    this.authenticationStore.setLoading(false);
  }

  loginOidc(): void {
    this.config.authConfig.subscribe((data) => {
      console.log(data);
      const sdk = new Sdk(data);
      window.open(sdk.getSigninUrl());
    });
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    try {
      const response = await fetch(`${config.backendUrl}/auth/refresh`, {
        method: "POST",
        body: JSON.stringify({
          AccessToken: accessToken,
          RefreshToken: refreshToken,
        }),
      });

      const data = (await response.json()) as TokenPersistance;

      sessionStorage.setItem(TOKEN_STORAGE, JSON.stringify(data));

      this.authenticationStore.setTokens(data.accessToken, data.refreshToken);
    } catch (e) {
      console.error(e);
    }
  }

  private async loadTokenFromStorage(): Promise<void> {
    const tokenData = sessionStorage.getItem(TOKEN_STORAGE);
    if (tokenData && tokenData.length > 0) {
      const tokens = JSON.parse(tokenData) as TokenPersistance;

      if (this.isTokenExpired(tokens.accessToken)) {
        // Our refresh token is still valid
        if (!this.isTokenExpired(tokens.refreshToken)) {
          await this.refreshToken(tokens.accessToken, tokens.refreshToken);
        }

        return;
      }

      this.authenticationStore.setTokens(
        tokens.accessToken,
        tokens.refreshToken
      );
    }
  }
}

export const authenticationService = new AuthenticationService(
  authenticationStore, configQuery
);
