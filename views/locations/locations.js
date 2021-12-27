"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightlogLocationsView = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const locations_styles_scss_1 = (0, tslib_1.__importDefault)(require("./locations.styles.scss"));
const _24_1 = (0, tslib_1.__importDefault)(require("@carbon/icons/es/add/24"));
require("@material/mwc-button");
const navigation_service_1 = require("../../shared/services/navigation.service");
let FlightlogLocationsView = class FlightlogLocationsView extends lit_1.LitElement {
    render() {
        return (0, lit_1.html) `
      <div class="create-button">
        <mwc-button unelevated @click=${this.createButtonClick}>
          <core-icon button .icon="${_24_1.default}"></core-icon>Create a new
          Start</mwc-button
        >
      </div>
      <p>TODO: Show your most recent locations</p>
      <p>TODO: Show locaitons with a lot of flights the last days</p>
    `;
    }
    createButtonClick() {
        navigation_service_1.navigationService.setCurrentRoute("/locations/create");
    }
};
FlightlogLocationsView.styles = [locations_styles_scss_1.default];
FlightlogLocationsView = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-location-view")
], FlightlogLocationsView);
exports.FlightlogLocationsView = FlightlogLocationsView;
//# sourceMappingURL=locations.js.map