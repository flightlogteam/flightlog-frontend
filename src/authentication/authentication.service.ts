import Keycloak from 'keycloak-js';
import {
  KeycloakConfig,
  KeycloakInitOptions,
  KeycloakInstance,
  KeycloakLoginOptions,
} from 'keycloak-js';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  from,
  iif,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { AccountInfo } from './models';

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

  rnd = Math.random();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  authorizationHeader$: Observable<string>;
  isAuthenticated$: Observable<boolean>;

  initOptions: KeycloakInitOptions = {
    redirectUri: this.getCallback(),
    onLoad: 'login-required',
    //silentCheckSsoRedirectUri: window.location.origin + '/users',
    pkceMethod: 'S256',
  };

  verify$: Observable<string>;

  loginOptions: KeycloakLoginOptions = {
    redirectUri: this.getCallback(),
  };

  config: KeycloakConfig = {
    url: 'http://localhost:8082',
    realm: 'flightlog',
    clientId: 'flightlog-frontend',
  };

  private getCallback(): string {
    return window.location.toString();
  }

  get accessToken$(): Observable<string> {
    return this.isAuthenticated$.pipe(
      filter(auth => auth),
      mergeMap(() => of(this.keycloak.token))
    );
  }

  get accountInfo$(): Observable<AccountInfo> {
    return this.isAuthenticated$.pipe(
      filter(loggedIn => loggedIn),
      switchMap(() => from(this.keycloak.loadUserInfo())),
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
    this.isAuthenticated$ = this.isAuthenticatedSubject
      .asObservable()
      .pipe(distinctUntilChanged(), shareReplay());
    this.keycloak = Keycloak(this.config);
    this.keycloak.init(this.initOptions).then(authenticated => {
      if (authenticated) {
        console.log('auth status', authenticated);
        if (!this.keycloak.token) {
          console.log('no token');
          this.keycloak
            .updateToken(100)
            .then(status => this.isAuthenticatedSubject.next(status));
        } else {
          console.log('We have a token');
          this.isAuthenticatedSubject.next(true);
        }
      }
      setInterval(() => {
        this.keycloak.updateToken(100);
      }, 70000);
    });

    this.verify$ = this.accessToken$.pipe(
      mergeMap(token =>
        ajax<string>({
          url: 'http://localhost:61225/auth/verify',
          method: 'GET',
          crossDomain: true,
          headers: { Authorization: `Bearer ${token}` },
        }).pipe(map(response => response.response))
      )
    );

    this.authorizationHeader$ = this.isAuthenticated$.pipe(
      mergeMap(authenticated =>
        iif(
          () => authenticated,
          this.accessToken$.pipe(map(token => `Bearer ${token}`)),
          of(undefined)
        )
      )
    );

    this.verify$.subscribe(res => console.log(res));
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
