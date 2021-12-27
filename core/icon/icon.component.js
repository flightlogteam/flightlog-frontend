"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreIconComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const icon_component_scss_1 = (0, tslib_1.__importDefault)(require("./icon.component.scss"));
const icon_helpers_1 = require("@carbon/icon-helpers");
let CoreIconComponent = class CoreIconComponent extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this._name = "";
        this.size = 20;
        this.button = false;
    }
    get name() {
        return this._name;
    }
    render() {
        return (0, lit_1.html) `<div class="icon-container ${this.button ? "button-icon" : ""}">
      ${this.renderNode(this.icon)}
    </div>`;
    }
    renderNode(icon) {
        if (!icon)
            return null;
        const element = (0, icon_helpers_1.toSVG)({
            ...icon,
            attrs: (0, icon_helpers_1.getAttributes)(icon.attrs),
        });
        element.setAttribute("height", `${this.size}`);
        element.setAttribute("width", `${this.size}`);
        return element;
    }
};
CoreIconComponent.styles = icon_component_scss_1.default;
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], CoreIconComponent.prototype, "icon", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], CoreIconComponent.prototype, "size", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)({ type: Boolean, reflect: true }),
    (0, tslib_1.__metadata)("design:type", Object)
], CoreIconComponent.prototype, "button", void 0);
CoreIconComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("core-icon")
], CoreIconComponent);
exports.CoreIconComponent = CoreIconComponent;
//# sourceMappingURL=icon.component.js.map