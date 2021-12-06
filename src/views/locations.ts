import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("flightlog-location-view")
export class FlightlogFlightsView extends LitElement {
  render(): TemplateResult {
    return html`location view works`;
  }
}
