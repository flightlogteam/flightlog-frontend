"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const wind_direction_component_1 = require("./wind-direction.component");
describe('passing in a decimal', () => {
    it('mounts without error', () => {
        document.body.appendChild(new wind_direction_component_1.FlightlogWindDirectionComponent());
    });
});
//# sourceMappingURL=wind-direction.component.spec.js.map