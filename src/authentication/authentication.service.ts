import Keycloak from "keycloak-js";
import {
  KeycloakConfig,
  KeycloakInitOptions,
  KeycloakInstance,
  KeycloakLoginOptions,
} from "keycloak-js";
import {
  BehaviorSubject,
  filter,
  from,
  map,
  mapTo,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { AccountInfo } from "./models";

interface KeyCloakUserInfo {
  email: string;
  email_verified: boolean;
  name: string;
  family_name: string;
  given_name: string;
  preferred_username: string;
}

export class AuthenticationService {
  keycloak: KeycloakInstance;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  initOptions: KeycloakInitOptions = {
    redirectUri: "http://localhost:8080/callback",
    onLoad: "check-sso",
    pkceMethod: "S256",
  };

  loginOptions: KeycloakLoginOptions = {
    redirectUri: "http://localhost:8080/callback",
  };

  config: KeycloakConfig = {
    url: "http://localhost:8082/auth",
    realm: "test",
    clientId: "test",
  };

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject;
  }

  get accessToken$(): Observable<string | undefined> {
    return of(this.keycloak.token);
  }

  get accountInfo$(): Observable<AccountInfo> {
    return this.isAuthenticated$.pipe(
      filter((loggedIn) => loggedIn),
      switchMap(() => from(this.keycloak.loadUserInfo())),
      mapTo(this.keycloak.userInfo),
      map(() => {
        const info = this.keycloak.userInfo as KeyCloakUserInfo;
        return {
          email: info.email,
          name: info.name,
          userName: info.preferred_username,
        };
      })
    );
  }

  constructor() {
    this.keycloak = Keycloak(this.config);
    this.keycloak.init(this.initOptions).then((authenticated) => {
      if (authenticated) {
        if (!this.keycloak.token) {
          this.keycloak
            .updateToken(100)
            .then((status) => this.isAuthenticatedSubject.next(status));
        } else {
          this.isAuthenticatedSubject.next(true);
        }
      } else {
      }

      setInterval(() => {
        this.keycloak.updateToken(100);
      }, 70000);
    });
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout().then(() => this.isAuthenticatedSubject.next(false));
  }

  changeUser() {
    window.location.href = this.keycloak.createAccountUrl();
  }
}

export const authenticationService = new AuthenticationService();
