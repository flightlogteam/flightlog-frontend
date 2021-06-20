import { LitElement, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators/custom-element";
import design from "./shared/styles/application.styles.scss";

@customElement("flightlog-app")
export class FlightLogApp extends LitElement {
  constructor() {
    super();
  }

  static styles = [design];

  render(): TemplateResult {
    return html`
      <flightlog-toolbar-component></flightlog-toolbar-component>
      <flightlog-login></flightlog-login>
    `;
  }
}
