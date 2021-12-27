"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterNavigationComponent = void 0;
const tslib_1 = require("tslib");
// TODO: Make a breakpoint-service to prevent code duplication
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
require("../toolbar/toolbar-navigation/toolbar-navigation");
const footer_component_styles_scss_1 = (0, tslib_1.__importDefault)(require("./footer.component.styles.scss"));
let FooterNavigationComponent = class FooterNavigationComponent extends lit_1.LitElement {
    constructor() {
        super();
        this.mobileDevice = false;
        this.footer.then((footer) => {
            this.resizeObserver = new ResizeObserver((entries) => {
                for (let i = 0; i < entries.length; i++) {
                    const width = entries[i].borderBoxSize[0].inlineSize;
                    this.mobileDevice = width < 786;
                }
            });
            this.resizeObserver.observe(footer);
        });
    }
    render() {
        return (0, lit_1.html) `
      <div class="footer">
        ${this.mobileDevice ? this.renderFooterContent() : ``}
      </div>
    `;
    }
    renderFooterContent() {
        return (0, lit_1.html) `
      <div class="footer-content">
        <toolbar-navigation-menu></toolbar-navigation-menu>
      </div>
    `;
    }
};
FooterNavigationComponent.styles = [footer_component_styles_scss_1.default];
(0, tslib_1.__decorate)([
    (0, decorators_js_1.queryAsync)(".footer"),
    (0, tslib_1.__metadata)("design:type", Promise)
], FooterNavigationComponent.prototype, "footer", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Object)
], FooterNavigationComponent.prototype, "mobileDevice", void 0);
FooterNavigationComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("core-footer"),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], FooterNavigationComponent);
exports.FooterNavigationComponent = FooterNavigationComponent;
//# sourceMappingURL=footer.component.js.map