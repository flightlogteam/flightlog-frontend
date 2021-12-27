"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewFlightComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
let NewFlightComponent = class NewFlightComponent extends lit_1.LitElement {
    render() {
        return (0, lit_1.html) `new flight works`;
    }
};
NewFlightComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-view-newflight")
], NewFlightComponent);
exports.NewFlightComponent = NewFlightComponent;
//# sourceMappingURL=newflight.js.map