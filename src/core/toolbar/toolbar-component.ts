import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state, queryAsync } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { from, mergeMap, of, Subscription, tap, withLatestFrom } from "rxjs";
import loginIcon from "@carbon/icons/es/login/20";
import logoutIcon from "@carbon/icons/es/logout/20";

import userIcon from "@carbon/icons/es/user/20";
import styles from "./toolbar-component.styles.scss";
import { authenticationService } from "../../authentication/authentication.service";
import { AccountInfo } from "../../authentication/models";
import "@material/mwc-menu";
import { Menu } from "@material/mwc-menu";
import "@material/mwc-list/mwc-list-item";
import {
  navigationService,
  Route,
} from "../../shared/services/navigation.service";

export interface NavigationConfig {
  title: string;
  icon: string;
  route: string;
}

@customElement("flightlog-toolbar-component")
export class ToolbarComponent extends LitElement {
  subscriptions: Subscription[] = [];

  @property()
  navigation: Route[] = [];

  @queryAsync("#user-menu")
  userMenuElement: Promise<Menu>;

  @state()
  isAuthenticated = false;

  @state()
  accountInfo: AccountInfo | undefined;

  @property()
  userId = "";
  @property({ attribute: false })
  currentRoute: Route = navigationService.currentRoute;

  constructor() {
    super();

    this.subscriptions.push(
      navigationService.mainNavigation$.subscribe(
        (routes) => (this.navigation = routes)
      )
    );

    this.subscriptions.push(
      authenticationService.isAuthenticated$.subscribe(
        (loggedIn) => (this.isAuthenticated = loggedIn)
      )
    );

    this.subscriptions.push(
      navigationService.currentRoute$.subscribe((route) => {
        this.currentRoute = route;
      })
    );

    this.subscriptions.push(
      authenticationService.accountInfo$.subscribe((info) => {
        this.accountInfo = info;
      })
    );
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
    super.disconnectedCallback();
  }

  static get styles() {
    return [styles];
  }

  render(): TemplateResult {
    return html`
      <div class="toolbar">
        <div class="toolbar-left">
          <flightlog-icon>flight_takeoff</flightlog-icon>
          <h2>Flightlogger</h2>
        </div>
        <div class="toolbar-right">
          <div class="navigation-items ">${this.navigationElements()}</div>
        </div>
        <div class="login-button">
          ${!this.isAuthenticated
            ? this.renderLoginButton()
            : this.renderUserIcon()}
        </div>
      </div>

      ${this.renderUserMenu()}
    `;
  }

  private renderUserIcon(): TemplateResult {
    return html`
      <div
        @click=${this.triggerUserMenu}
        id="user-menu-button"
        class="navigation-item"
      >
        <core-icon size="24" .icon="${userIcon}"></core-icon>
        <h5>${this.accountInfo?.userName}</h5>
      </div>
    `;
  }

  private renderLoginButton(): TemplateResult {
    return html`
      <div @click="${this.login}" class="navigation-item">
        <core-icon size="24" .icon="${loginIcon}"></core-icon>
        <h5>Login</h5>
      </div>
    `;
  }

  private renderUserMenu(): TemplateResult {
    return html`
      <mwc-menu id="user-menu">
        <mwc-list-item @click="${this.logoutClick}"
          ><core-icon size="12" .icon="${logoutIcon}"></core-icon> Sign
          out</mwc-list-item
        >
      </mwc-menu>
    `;
  }

  private logoutClick() {
    console.log("logging out");
    authenticationService.logout();
  }

  private triggerUserMenu() {
    from(this.userMenuElement)
      .pipe(
        withLatestFrom(of(this.shadowRoot.getElementById("user-menu-button")))
      )
      .subscribe(([userMenu, button]) => {
        console.log(userMenu, button);
        userMenu.anchor = button;
        userMenu.corner = "BOTTOM_LEFT";
        userMenu.show();
      });
  }

  private login() {
    authenticationService.login();
  }

  private navigationElements(): TemplateResult {
    return html`
      ${this.navigation.map((item) => this.navigationElement(item))}
    `;
  }

  private navigationElement(item: Route): TemplateResult {
    const classes = {
      "navigation-item": "navigation-item",
      active: this.currentRoute.route === item.route,
    };
    return html`
      <div
        @click="${() => this.navigationChange(item.route)}"
        class=${classMap(classes)}
      >
        <flightlog-icon>${item.icon}</flightlog-icon>
        <h5>${item.name}</h5>
      </div>
    `;
  }

  navigationChange(route: string): void {
    navigationService.setCurrentRoute(route, {});
  }
}
