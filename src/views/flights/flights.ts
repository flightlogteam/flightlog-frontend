import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("flightlog-view-flights")
export class FlightComponent extends LitElement {
  render(): TemplateResult {
    return html`flight works`;
  }
}
