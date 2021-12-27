"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
let FlightComponent = class FlightComponent extends lit_1.LitElement {
    render() {
        return (0, lit_1.html) `flight works`;
    }
};
FlightComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-view-flights")
], FlightComponent);
exports.FlightComponent = FlightComponent;
//# sourceMappingURL=flights.js.map