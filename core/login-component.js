"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
let LoginComponent = class LoginComponent extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this.username = "";
        this.password = "";
    }
    render() {
        return (0, lit_1.html) `
      <input
        @input="${this.userNameChanged}"
        id="username"
        .value="${this.username}"
      />
      <input
        @input="${this.passwordChanged}"
        id="password"
        type="password"
        .value="${this.password}"
      />
      <button @click="${this.submit}" ?disabled="${this.submitDisabled}">
        Login ${this.username}
      </button>
    `;
    }
    submit() {
        //authenticationService.login(this.username, this.password);
    }
    userNameChanged() {
        this.username = this.usernameInput?.value || "";
    }
    passwordChanged() {
        this.password = this.passwordInput?.value || "";
    }
    get submitDisabled() {
        return this.password.length < 6 && this.username.length == 0;
    }
};
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)({ attribute: false }),
    (0, tslib_1.__metadata)("design:type", Object)
], LoginComponent.prototype, "username", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)({ attribute: false }),
    (0, tslib_1.__metadata)("design:type", Object)
], LoginComponent.prototype, "password", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)("#username"),
    (0, tslib_1.__metadata)("design:type", HTMLInputElement)
], LoginComponent.prototype, "usernameInput", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)("#password"),
    (0, tslib_1.__metadata)("design:type", HTMLInputElement)
], LoginComponent.prototype, "passwordInput", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)({ attribute: false }),
    (0, tslib_1.__metadata)("design:type", Boolean),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], LoginComponent.prototype, "submitDisabled", null);
LoginComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-login")
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login-component.js.map