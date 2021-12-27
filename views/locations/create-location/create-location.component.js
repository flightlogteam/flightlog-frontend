"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLocationComponent = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
require("@material/mwc-tab-bar");
require("@material/tab-bar");
require("src/location/components/creation/where");
require("@material/mwc-button");
const create_location_component_styles_scss_1 = (0, tslib_1.__importDefault)(require("./create-location.component.styles.scss"));
require("src/shared/components/wind-direction/wind-direction.component");
let CreateLocationComponent = class CreateLocationComponent extends lit_1.LitElement {
    constructor() {
        super();
        this._currentIndex = 0;
        this.currentLocation = 1;
    }
    tabChanged(index) {
        console.log(index.detail.index);
        this._currentIndex = index.detail.index;
    }
    render() {
        return (0, lit_1.html) `<container-component>
      <flightlog-wind-direction modifyable></flightlog-wind-direction>
      <mwc-tab-bar @MDCTabBar:activated="${this.tabChanged}">
        <mwc-tab label="Start" icon="flight_takeoff"></mwc-tab>
        <mwc-tab label="Landings" icon="flight_land"></mwc-tab>
      </mwc-tab-bar>

      ${this.renderTab()}
      <div class="tab-content">
        <div id="creation-steps"></div>
      </div>
    </container-component>`;
    }
    renderTab() {
        switch (this._currentIndex) {
            case 0:
                return (0, lit_1.html) `<flightlog-create-location></flightlog-create-location>`;
            case 1:
                return this.renderLandingLocations();
            default:
                return (0, lit_1.html) `something wrong`;
        }
    }
    renderLandingLocations() {
        const content = [];
        content.push((0, lit_1.html) `
        <div class="actions">
          <mwc-button
            unelevated
            icon="add"
            @click="${() => this.currentLocation++}"
            >Add landing</mwc-button
          >
          <mwc-button unelevated icon="save">Store</mwc-button>
        </div>
      `);
        for (let i = 1; i <= this.currentLocation; i++) {
            content.push((0, lit_1.html) `<flightlog-create-location
          .locationIndex="${i}"
        ></flightlog-create-location>`);
        }
        return content;
    }
};
CreateLocationComponent.styles = [create_location_component_styles_scss_1.default];
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Object)
], CreateLocationComponent.prototype, "_currentIndex", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.queryAsync)('#creation-steps'),
    (0, tslib_1.__metadata)("design:type", Promise)
], CreateLocationComponent.prototype, "creationDiv", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Object)
], CreateLocationComponent.prototype, "currentLocation", void 0);
CreateLocationComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)('location-creation-view'),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], CreateLocationComponent);
exports.CreateLocationComponent = CreateLocationComponent;
//# sourceMappingURL=create-location.component.js.map