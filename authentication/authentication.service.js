"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationService = exports.AuthenticationService = void 0;
const tslib_1 = require("tslib");
const keycloak_js_1 = (0, tslib_1.__importDefault)(require("keycloak-js"));
const rxjs_1 = require("rxjs");
const ajax_1 = require("rxjs/ajax");
class AuthenticationService {
    constructor() {
        this.isAuthenticatedSubject = new rxjs_1.BehaviorSubject(false);
        this.initOptions = {
            redirectUri: this.getCallback(),
            onLoad: 'check-sso',
            pkceMethod: 'S256',
        };
        this.loginOptions = {
            redirectUri: this.getCallback(),
        };
        this.config = {
            url: 'http://localhost:8082/auth',
            realm: 'test',
            clientId: 'test',
        };
        this.keycloak = (0, keycloak_js_1.default)(this.config);
        this.keycloak.init(this.initOptions).then((authenticated) => {
            if (authenticated) {
                if (!this.keycloak.token) {
                    this.keycloak
                        .updateToken(100)
                        .then((status) => this.isAuthenticatedSubject.next(status));
                }
                else {
                    this.isAuthenticatedSubject.next(true);
                }
            }
            setInterval(() => {
                this.keycloak.updateToken(100);
            }, 70000);
        });
        this.verify$ = this.accessToken$.pipe((0, rxjs_1.mergeMap)((token) => (0, ajax_1.ajax)({
            url: 'http://localhost:8083/auth/verify',
            method: 'GET',
            crossDomain: true,
            headers: { Authorization: `Bearer ${token}` },
        }).pipe((0, rxjs_1.map)((response) => response.response))));
        this.verify$.subscribe((res) => console.log(res));
    }
    getCallback() {
        return window.location.toString();
    }
    get isAuthenticated$() {
        return this.isAuthenticatedSubject;
    }
    get accessToken$() {
        return this.isAuthenticated$.pipe((0, rxjs_1.filter)((auth) => auth), (0, rxjs_1.mergeMap)(() => (0, rxjs_1.of)(this.keycloak.token)));
    }
    get accountInfo$() {
        return this.isAuthenticated$.pipe((0, rxjs_1.filter)((loggedIn) => loggedIn), (0, rxjs_1.switchMap)(() => (0, rxjs_1.from)(this.keycloak.loadUserInfo())), (0, rxjs_1.mapTo)(this.keycloak.userInfo), (0, rxjs_1.map)(() => {
            const info = this.keycloak.userInfo;
            return {
                email: info.email,
                name: info.name,
                userName: info.preferred_username,
            };
        }));
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
exports.AuthenticationService = AuthenticationService;
exports.authenticationService = new AuthenticationService();
//# sourceMappingURL=authentication.service.js.map