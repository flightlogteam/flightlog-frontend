import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import style from "./locations.styles.scss";
import plusIcon from "@carbon/icons/es/add/24";

import "@material/mwc-button";
import { navigationService } from "../../shared/services/navigation.service";

@customElement("flightlog-location-view")
export class FlightlogLocationsView extends LitElement {
  static styles = [style];

  render(): TemplateResult {
    return html`
      <div class="create-button">
        <mwc-button unelevated @click=${this.createButtonClick}>
          <core-icon button .icon="${plusIcon}"></core-icon>Create a new
          Start</mwc-button
        >
      </div>
      <p>TODO: Show your most recent locations</p>
      <p>TODO: Show locaitons with a lot of flights the last days</p>
    `;
  }

  private createButtonClick() {
    navigationService.setCurrentRoute("/locations/create");
  }
}
