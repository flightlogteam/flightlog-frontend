import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("flightlog-view-notfound")
export class NotFoundView extends LitElement {
  render(): TemplateResult {
    return html`Not found works`;
  }
}
