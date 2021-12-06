import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("flightlog-users-view")
export class FlightlogUsersView extends LitElement {
  render(): TemplateResult {
    return html`users view works`;
  }
}
