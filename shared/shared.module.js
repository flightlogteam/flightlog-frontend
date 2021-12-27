"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_component_1 = require("./components/container/container.component");
const icon_1 = require("./components/icon");
const location_search_component_1 = require("./components/location-search/location-search.component");
class SharedModule {
    constructor() {
        this.elements = [icon_1.Icon, location_search_component_1.LocationSearch, container_component_1.ContainerComponent];
    }
}
exports.default = SharedModule;
//# sourceMappingURL=shared.module.js.map