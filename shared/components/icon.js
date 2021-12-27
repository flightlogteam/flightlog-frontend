"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
let Icon = class Icon extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this.iconName = "face";
        this.fontSize = 24;
    }
    render() {
        return (0, lit_1.html) `<span
      style="font-size: ${this.fontSize}px"
      class="material-icons"
      >${this.iconName}</span
    >`;
    }
    connectedCallback() {
        super.connectedCallback();
        try {
            this.iconName = this.innerHTML.split(">")[1];
        }
        catch {
            console.error("Cannot parse that icon");
        }
    }
};
Icon.styles = (0, lit_1.css) `
    .material-icons {
      font-family: "Material Icons";
      font-weight: normal;
      font-style: normal;
      font-size: 24px; /* Preferred icon size */
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;

      /* Support for all WebKit browsers. */
      -webkit-font-smoothing: antialiased;
      /* Support for Safari and Chrome. */
      text-rendering: optimizeLegibility;

      /* Support for Firefox. */
      -moz-osx-font-smoothing: grayscale;

      /* Support for IE. */
      font-feature-settings: "liga";
    }
  `;
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)({
        attribute: false,
    }),
    (0, tslib_1.__metadata)("design:type", Object)
], Icon.prototype, "iconName", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], Icon.prototype, "fontSize", void 0);
Icon = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-icon")
], Icon);
exports.Icon = Icon;
//# sourceMappingURL=icon.js.map