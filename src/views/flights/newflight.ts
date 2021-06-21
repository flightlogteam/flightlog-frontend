import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("flightlog-view-newflight")
export class NewFlightComponent extends LitElement {
  render(): TemplateResult {
    return html`new flight works`;
  }
}
