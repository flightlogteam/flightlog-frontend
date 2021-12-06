import { html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { Subscription } from "rxjs";
import {
  navigationService,
  Route,
} from "../../../shared/services/navigation.service";
import styles from "./toolbar-navigation.styles.scss";

@customElement("toolbar-navigation-menu")
export class ToolbarNavigationComponent extends LitElement {
  static styles = [styles];

  @state()
  navigation: Route[];

  @state()
  currentRoute: Route = navigationService.currentRoute;

  private subscriptions: Subscription[] = [];

  constructor() {
    super();
    this.subscriptions.push(
      navigationService.mainNavigation$.subscribe(
        (routes) => (this.navigation = routes)
      )
    );

    this.subscriptions.push(
      navigationService.currentRoute$.subscribe((route) => {
        this.currentRoute = route;
      })
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  render(): TemplateResult {
    return html`
      <div class="navigation-items ">${this.navigationElements()}</div>
    `;
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
  private navigationChange(route: string): void {
    navigationService.setCurrentRoute(route, {});
  }
}
