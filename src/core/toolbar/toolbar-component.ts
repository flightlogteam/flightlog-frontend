import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Subscription } from "rxjs";
import { authenticationQuery } from "../../shared/authentication/state";
import { navigationQuery, Route } from "../../shared/state/navigation/state";
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

  constructor() {
    super();
    this.subscriptions.push(
      navigationQuery.mainNavigation.subscribe(
        (routes) => (this.navigation = routes)
      )
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
          <div class="navigation-items">${this.navigationElements()}</div>
        </div>
      </div>
    `;
  }

  navigationElements(): TemplateResult {
    return html`
      ${this.navigation.map((item) => this.navigationElement(item))}
    `;
  }

  navigationElement(item: Route): TemplateResult {
    return html`
      <div
        @click="${() => this.navigationChange(item.route)}"
        class="navigation-item"
      >
        <flightlog-icon>${item.icon}</flightlog-icon>
        <h5>${item.name}</h5>
      </div>
    `;
  }

  navigationChange(route: string): void {
    console.log(route);
  }
}
