"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarNavigationComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const class_map_js_1 = require("lit/directives/class-map.js");
const navigation_service_1 = require("../../../shared/services/navigation.service");
const toolbar_navigation_styles_scss_1 = (0, tslib_1.__importDefault)(require("./toolbar-navigation.styles.scss"));
let ToolbarNavigationComponent = class ToolbarNavigationComponent extends lit_1.LitElement {
    constructor() {
        super();
        this.currentRoute = navigation_service_1.navigationService.currentRoute;
        this.subscriptions = [];
        this.subscriptions.push(navigation_service_1.navigationService.mainNavigation$.subscribe((routes) => (this.navigation = routes)));
        this.subscriptions.push(navigation_service_1.navigationService.currentRoute$.subscribe((route) => {
            this.currentRoute = route;
        }));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
    render() {
        return (0, lit_1.html) `
      <div class="navigation-items ">${this.navigationElements()}</div>
    `;
    }
    navigationElements() {
        return (0, lit_1.html) `
      ${this.navigation.map((item) => this.navigationElement(item))}
    `;
    }
    navigationElement(item) {
        const classes = {
            "navigation-item": "navigation-item",
            active: this.currentRoute.route === item.route,
        };
        return (0, lit_1.html) `
      <div
        @click="${() => this.navigationChange(item.route)}"
        class=${(0, class_map_js_1.classMap)(classes)}
      >
        <flightlog-icon>${item.icon}</flightlog-icon>
        <h5>${item.name}</h5>
      </div>
    `;
    }
    navigationChange(route) {
        navigation_service_1.navigationService.setCurrentRoute(route, {});
    }
};
ToolbarNavigationComponent.styles = [toolbar_navigation_styles_scss_1.default];
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Array)
], ToolbarNavigationComponent.prototype, "navigation", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Object)
], ToolbarNavigationComponent.prototype, "currentRoute", void 0);
ToolbarNavigationComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("toolbar-navigation-menu"),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], ToolbarNavigationComponent);
exports.ToolbarNavigationComponent = ToolbarNavigationComponent;
//# sourceMappingURL=toolbar-navigation.js.map