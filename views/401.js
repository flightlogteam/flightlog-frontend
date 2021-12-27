"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedView = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
let UnauthorizedView = class UnauthorizedView extends lit_1.LitElement {
    render() {
        return (0, lit_1.html) `unauthorized works`;
    }
};
UnauthorizedView = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-view-unauthorized")
], UnauthorizedView);
exports.UnauthorizedView = UnauthorizedView;
//# sourceMappingURL=401.js.map