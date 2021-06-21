import { LitElement, html, TemplateResult } from "lit";
import { query } from "lit/decorators.js";
import { customElement } from "lit/decorators/custom-element";
import { Subscription } from "rxjs";
import {
  ImportResult,
  navigationQuery,
  Route,
} from "./shared/state/navigation/state";
import design from "./shared/styles/application.styles.scss";
import componentStyles from "./flightlog-app.styles.scss";
import { updateMetadata } from "pwa-helpers/metadata";

interface constructableObject {
  new (): Node;
}

@customElement("flightlog-app")
export class FlightLogApp extends LitElement {
  @query("#view-container")
  viewContainer: HTMLDivElement;

  subscriptions: Subscription[] = [];

  constructor() {
    super();
    this.subscriptions.push(
      navigationQuery.currentRoute.subscribe((route) => {
        this.currentRoute = route;
        this.loadView();
        updateMetadata({
          title: `Flightlog - ${route.name}`,
          description: `Flightlog is the next generation free flight logging tool`,
        });
      })
    );
    this.loadView();
  }

  private async loadView(): Promise<void> {
    if (this.currentRoute.action) {
      try {
        const component: ImportResult = await this.currentRoute.action();
        if (this.viewContainer) {
          this.viewContainer.innerHTML = "";
          // The object only have one key and we should construct that element
          for (const key of Object.keys(component)) {
            const element = component[key] as constructableObject;
            this.viewContainer.appendChild(new element());
          }
        }
      } catch (e) {
        console.error(`unable to load view: ${e}`);
      }
    }
  }

  currentRoute: Route = navigationQuery.route;

  static styles = [design, componentStyles];

  render(): TemplateResult {
    return html`
      <flightlog-toolbar-component></flightlog-toolbar-component>
      <div id="view-container"></div>
    `;
  }
}
