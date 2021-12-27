"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const container_component_styles_scss_1 = (0, tslib_1.__importDefault)(require("./container.component.styles.scss"));
let ContainerComponent = class ContainerComponent extends lit_1.LitElement {
    render() {
        return (0, lit_1.html) ` <div class="container"><slot></slot></div> `;
    }
};
ContainerComponent.styles = [container_component_styles_scss_1.default];
ContainerComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("container-component")
], ContainerComponent);
exports.ContainerComponent = ContainerComponent;
//# sourceMappingURL=container.component.js.map