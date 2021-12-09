import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import style from "./locations.styles.scss";

import "@material/mwc-button";

@customElement("flightlog-location-view")
export class FlightlogLocationsView extends LitElement {
  static styles = [style];

  render(): TemplateResult {
    return html` <span class="material-icons">face</span>
      <mwc-button
        outlined
        label="Create a new location"
        icon="plus"
      ></mwc-button>`;
  }
}
