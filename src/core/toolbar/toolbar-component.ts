import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state, queryAsync } from "lit/decorators.js";
import { from, of, Subscription, withLatestFrom } from "rxjs";
import loginIcon from "@carbon/icons/es/login/20";
import logoutIcon from "@carbon/icons/es/logout/20";

import userIcon from "@carbon/icons/es/user/20";
import faceIcon from "@carbon/icons/es/face--activated/20";
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
import "./toolbar-navigation/toolbar-navigation";

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

  @queryAsync(".toolbar")
  toolbarContainer: Promise<HTMLDivElement>;

  @state()
  mobileDevice = false;

  @state()
  isAuthenticated = false;

  @state()
  accountInfo: AccountInfo | undefined;

  @property()
  userId = "";

  private resizeObserver: ResizeObserver | undefined;

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
      authenticationService.accountInfo$.subscribe((info) => {
        this.accountInfo = info;
      })
    );

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

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

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
        ${this.mobileDevice ? html`` : this.renderBrowserToolbar()}
        <div class="login-button">
          ${!this.isAuthenticated
            ? this.renderLoginButton()
            : this.renderUserIcon()}
        </div>
      </div>

      ${this.renderUserMenu()}
    `;
  }

  private renderBrowserToolbar(): TemplateResult {
    return html`
      <div class="toolbar-right">
        <toolbar-navigation-menu></toolbar-navigation-menu>
      </div>
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
        <mwc-list-item twoline avatar graphic="avatar">
          <span>${this.accountInfo?.name}</span>
          <span slot="secondary">${this.accountInfo?.email}</span>
          <span slot="graphic"
            ><core-icon size="40" .icon="${faceIcon}"></core-icon
          ></span>
        </mwc-list-item>
        <li divider></li>
        <mwc-list-item @click="${this.logoutClick}"
          ><core-icon size="12" .icon="${logoutIcon}"></core-icon> Sign
          out</mwc-list-item
        >
        <mwc-list-item @click="${this.editUserClick}"
          ><core-icon size="12" .icon="${logoutIcon}"></core-icon> Edit
          user</mwc-list-item
        >
      </mwc-menu>
    `;
  }

  private editUserClick() {
    authenticationService.changeUser();
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
}
