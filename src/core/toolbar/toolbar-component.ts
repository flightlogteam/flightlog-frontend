import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { Subscription } from "rxjs";
import { authenticationQuery, authenticationService } from "../../shared/authentication/state";
import loginIcon from "@carbon/icons/es/login/20";
import {
  navigationQuery,
  navigationService,
  Route,
} from "../../shared/state/navigation/state";
import styles from "./toolbar-component.styles.scss";

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

  @property()
  userId = "";
  @property({ attribute: false }) currentRoute: Route = navigationQuery.route; constructor() {
    super();
    this.subscriptions.push(
      navigationQuery.mainNavigation.subscribe(
        (routes) => (this.navigation = routes)
      )
    );

    this.subscriptions.push(
      navigationQuery.currentRoute.subscribe((route) => {
        this.currentRoute = route;
      })
    );
  }

  connectedCallback(): void {
    this.subscriptions.push(
      authenticationQuery.userId.subscribe((id) => {
        this.userId = id;
      })
    );
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
          <div @click="${this.login}" class="navigation-item">
            <core-icon size="24" .icon="${loginIcon}"></core-icon>
            <h5>Login</h5>
          </div>
        </div>
      </div>
    `;
  }

  login() {
    authenticationService.loginOidc();
  }

  navigationElements(): TemplateResult {
    return html`
      ${this.navigation.map((item) => this.navigationElement(item))}
    `;
  }

  navigationElement(item: Route): TemplateResult {
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
    navigationService.navigate(route, {});
  }
}
