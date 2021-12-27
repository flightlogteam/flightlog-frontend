"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightlogWindDirectionComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const rxjs_1 = require("rxjs");
const wind_direction_component_styles_scss_1 = (0, tslib_1.__importDefault)(require("./wind-direction.component.styles.scss"));
const wind_image_1 = require("./wind-image");
const colorMappings = [
    { name: 'green', value: 'rgb(85, 170, 85)' },
    { name: 'white', value: 'rgb(255, 255, 255)' },
    { name: 'yellow', value: 'rgb(251, 255, 0)' },
];
let FlightlogWindDirectionComponent = class FlightlogWindDirectionComponent extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this.size = 300;
        this.direction = 0;
        this.modifyable = false;
        this.subscriptions = [];
    }
    firstUpdated() {
        console.log(this.pathElements);
        this.subscriptions.push((0, rxjs_1.fromEvent)(this.pathElements, 'click')
            .pipe((0, rxjs_1.filter)((event) => !event.target.id.startsWith('path')), (0, rxjs_1.map)((event) => event.target))
            .subscribe((path) => {
            this.toggleColor(path);
        }));
    }
    disconnectedCallback() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
    render() {
        return (0, lit_1.svg) `
      ${wind_image_1.WindImage}
    `;
    }
    toggleColor(element) {
        if (!this.modifyable) {
            return;
        }
        const currentColor = element.style.fill;
        const currentMapping = colorMappings.find((mapping) => mapping.value.toUpperCase() === currentColor.toUpperCase());
        if (currentMapping) {
            switch (currentMapping.name) {
                case 'white':
                    this.addColorToPath(element, 'green');
                    break;
                case 'green':
                    this.addColorToPath(element, 'yellow');
                    break;
                case 'yellow':
                    this.addColorToPath(element, 'white');
                    break;
            }
        }
    }
    addColorToPath(element, color = 'white') {
        const chosenColor = colorMappings.find((mapping) => mapping.name === color);
        if (chosenColor) {
            element.style.fill = chosenColor.value;
        }
    }
};
FlightlogWindDirectionComponent.styles = [wind_direction_component_styles_scss_1.default];
(0, tslib_1.__decorate)([
    (0, decorators_js_1.queryAll)('path'),
    (0, tslib_1.__metadata)("design:type", Object)
], FlightlogWindDirectionComponent.prototype, "pathElements", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], FlightlogWindDirectionComponent.prototype, "size", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], FlightlogWindDirectionComponent.prototype, "direction", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)({ type: Boolean }),
    (0, tslib_1.__metadata)("design:type", Object)
], FlightlogWindDirectionComponent.prototype, "modifyable", void 0);
FlightlogWindDirectionComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)('flightlog-wind-direction')
], FlightlogWindDirectionComponent);
exports.FlightlogWindDirectionComponent = FlightlogWindDirectionComponent;
//# sourceMappingURL=wind-direction.component.js.map