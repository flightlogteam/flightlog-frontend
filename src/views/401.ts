import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("flightlog-view-unauthorized")
export class UnauthorizedView extends LitElement {
  render(): TemplateResult {
    return html`unauthorized works`;
  }
}
