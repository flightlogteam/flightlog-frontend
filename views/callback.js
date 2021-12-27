"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackViewComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
let CallbackViewComponent = class CallbackViewComponent extends lit_1.LitElement {
    render() {
        return (0, lit_1.html) `Callback`;
    }
    constructor() {
        super();
        //navigationService.setCurrentRoute("/");
    }
};
CallbackViewComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-view-unauthorized"),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], CallbackViewComponent);
exports.CallbackViewComponent = CallbackViewComponent;
//# sourceMappingURL=callback.js.map