"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const rxjs_1 = require("rxjs");
const _20_1 = (0, tslib_1.__importDefault)(require("@carbon/icons/es/login/20"));
const _20_2 = (0, tslib_1.__importDefault)(require("@carbon/icons/es/logout/20"));
const _20_3 = (0, tslib_1.__importDefault)(require("@carbon/icons/es/user/20"));
const _20_4 = (0, tslib_1.__importDefault)(require("@carbon/icons/es/face--activated/20"));
const toolbar_component_styles_scss_1 = (0, tslib_1.__importDefault)(require("./toolbar-component.styles.scss"));
const authentication_service_1 = require("../../authentication/authentication.service");
require("@material/mwc-menu");
require("@material/mwc-list/mwc-list-item");
const navigation_service_1 = require("../../shared/services/navigation.service");
require("./toolbar-navigation/toolbar-navigation");
let ToolbarComponent = class ToolbarComponent extends lit_1.LitElement {
    constructor() {
        super();
        this.subscriptions = [];
        this.navigation = [];
        this.mobileDevice = false;
        this.isAuthenticated = false;
        this.userId = "";
        this.subscriptions.push(navigation_service_1.navigationService.mainNavigation$.subscribe((routes) => (this.navigation = routes)));
        this.subscriptions.push(authentication_service_1.authenticationService.isAuthenticated$.subscribe((loggedIn) => (this.isAuthenticated = loggedIn)));
        this.subscriptions.push(authentication_service_1.authenticationService.accountInfo$.subscribe((info) => {
            this.accountInfo = info;
        }));
        this.toolbarContainer.then((toolbar) => {
            this.resizeObserver = new ResizeObserver((entries) => {
                for (let i = 0; i < entries.length; i++) {
                    const width = entries[i].borderBoxSize[0].inlineSize;
                    this.mobileDevice = width < 786;
                }
            });
            this.resizeObserver.observe(toolbar);
        });
    }
    connectedCallback() {
        super.connectedCallback();
    }
    disconnectedCallback() {
        this.subscriptions.forEach((item) => {
            item.unsubscribe();
        });
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        super.disconnectedCallback();
    }
    static get styles() {
        return [toolbar_component_styles_scss_1.default];
    }
    render() {
        return (0, lit_1.html) `
      <div class="toolbar">
        <div class="toolbar-left">
          <flightlog-icon>flight_takeoff</flightlog-icon>
          <h2>Flightlogger</h2>
        </div>
        ${this.mobileDevice ? (0, lit_1.html) `` : this.renderBrowserToolbar()}
        <div class="login-button">
          ${!this.isAuthenticated
            ? this.renderLoginButton()
            : this.renderUserIcon()}
        </div>
      </div>

      ${this.renderUserMenu()}
    `;
    }
    renderBrowserToolbar() {
        return (0, lit_1.html) `
      <div class="toolbar-right">
        <toolbar-navigation-menu></toolbar-navigation-menu>
      </div>
    `;
    }
    renderUserIcon() {
        return (0, lit_1.html) `
      <div
        @click=${this.triggerUserMenu}
        id="user-menu-button"
        class="navigation-item"
      >
        <core-icon size="24" .icon="${_20_3.default}"></core-icon>
        <h5>${this.accountInfo?.userName}</h5>
      </div>
    `;
    }
    renderLoginButton() {
        return (0, lit_1.html) `
      <div @click="${this.login}" class="navigation-item">
        <core-icon size="24" .icon="${_20_1.default}"></core-icon>
        <h5>Login</h5>
      </div>
    `;
    }
    renderUserMenu() {
        return (0, lit_1.html) `
      <mwc-menu id="user-menu">
        <mwc-list-item twoline avatar graphic="avatar">
          <span>${this.accountInfo?.name}</span>
          <span slot="secondary">${this.accountInfo?.email}</span>
          <span slot="graphic"
            ><core-icon size="40" .icon="${_20_4.default}"></core-icon
          ></span>
        </mwc-list-item>
        <li divider></li>
        <mwc-list-item @click="${this.logoutClick}"
          ><core-icon size="12" .icon="${_20_2.default}"></core-icon> Sign
          out</mwc-list-item
        >
        <mwc-list-item @click="${this.editUserClick}"
          ><core-icon size="12" .icon="${_20_2.default}"></core-icon> Edit
          user</mwc-list-item
        >
      </mwc-menu>
    `;
    }
    editUserClick() {
        authentication_service_1.authenticationService.changeUser();
    }
    logoutClick() {
        console.log("logging out");
        authentication_service_1.authenticationService.logout();
    }
    triggerUserMenu() {
        (0, rxjs_1.from)(this.userMenuElement)
            .pipe((0, rxjs_1.withLatestFrom)((0, rxjs_1.of)(this.shadowRoot.getElementById("user-menu-button"))))
            .subscribe(([userMenu, button]) => {
            console.log(userMenu, button);
            userMenu.anchor = button;
            userMenu.corner = "BOTTOM_LEFT";
            userMenu.show();
        });
    }
    login() {
        authentication_service_1.authenticationService.login();
    }
};
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Array)
], ToolbarComponent.prototype, "navigation", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.queryAsync)("#user-menu"),
    (0, tslib_1.__metadata)("design:type", Promise)
], ToolbarComponent.prototype, "userMenuElement", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.queryAsync)(".toolbar"),
    (0, tslib_1.__metadata)("design:type", Promise)
], ToolbarComponent.prototype, "toolbarContainer", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Object)
], ToolbarComponent.prototype, "mobileDevice", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Object)
], ToolbarComponent.prototype, "isAuthenticated", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Object)
], ToolbarComponent.prototype, "accountInfo", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], ToolbarComponent.prototype, "userId", void 0);
ToolbarComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-toolbar-component"),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], ToolbarComponent);
exports.ToolbarComponent = ToolbarComponent;
//# sourceMappingURL=toolbar-component.js.map