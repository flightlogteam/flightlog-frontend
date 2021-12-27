"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const footer_component_1 = require("./footer/footer.component");
const icon_component_1 = require("./icon/icon.component");
const login_component_1 = require("./login-component");
const toolbar_component_1 = require("./toolbar/toolbar-component");
class CoreModule {
    constructor() {
        this.elements = [
            toolbar_component_1.ToolbarComponent,
            login_component_1.LoginComponent,
            icon_component_1.CoreIconComponent,
            footer_component_1.FooterNavigationComponent,
        ];
    }
}
exports.default = CoreModule;
//# sourceMappingURL=core.module.js.map