import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("flightlog-view-dashboard")
export class DashboardViewComponent extends LitElement {
  render(): TemplateResult {
    return html` dashboard-view works`;
  }
}
