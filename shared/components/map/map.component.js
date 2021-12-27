"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightlogMapComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const Map_1 = (0, tslib_1.__importDefault)(require("ol/Map"));
const Tile_1 = (0, tslib_1.__importDefault)(require("ol/layer/Tile"));
const View_1 = (0, tslib_1.__importDefault)(require("ol/View"));
const source_1 = require("ol/source");
const Vector_1 = (0, tslib_1.__importDefault)(require("ol/layer/Vector"));
const Vector_2 = (0, tslib_1.__importDefault)(require("ol/source/Vector"));
const proj_1 = require("ol/proj");
const map_component_styles_scss_1 = (0, tslib_1.__importDefault)(require("./map.component.styles.scss"));
const Style_1 = (0, tslib_1.__importDefault)(require("ol/style/Style"));
const Icon_1 = (0, tslib_1.__importDefault)(require("ol/style/Icon"));
const _20_1 = (0, tslib_1.__importDefault)(require("@carbon/icons/es/location/20"));
const icon_helpers_1 = require("@carbon/icon-helpers");
const ol_1 = require("ol");
const Point_1 = (0, tslib_1.__importDefault)(require("ol/geom/Point"));
const rxjs_1 = require("rxjs");
let FlightlogMapComponent = class FlightlogMapComponent extends lit_1.LitElement {
    constructor() {
        super();
        this.map$ = new rxjs_1.ReplaySubject(1);
        this.subscriptions = [];
        this.mapTarget.then((target) => {
            const view = new View_1.default({
                projection: 'EPSG:3857',
                center: [1891337, 9772319],
                zoom: 5,
            });
            //End View definitions
            //Start: Map definitions
            const map = new Map_1.default({
                target: target,
                view,
            });
            const _url = 'http://opencache.statkart.no/gatekeeper/gk/gk.open?';
            //Start: source
            const sourceWMSC = new source_1.TileWMS({
                url: _url,
                params: {
                    LAYERS: 'norges_grunnkart',
                    VERSION: '1.1.1',
                },
            });
            //End: source
            //Start: layer
            const tileLayerWMSC = new Tile_1.default({
                source: sourceWMSC,
            });
            map.addLayer(tileLayerWMSC);
            map.on('singleclick', (event) => {
                this.addMarker(event.coordinate);
                this.dispatchLocationEvent(event.coordinate);
            });
            const svg = (0, icon_helpers_1.toSVG)(_20_1.default).outerHTML;
            this.vectorSource = new Vector_2.default();
            this.markerLayer = new Vector_1.default({
                source: this.vectorSource,
                style: new Style_1.default({
                    image: new Icon_1.default({
                        src: 'data:image/svg+xml;utf8,' + svg,
                        scale: 1.5,
                    }),
                }),
            });
            map.addLayer(this.markerLayer);
            this.map$.next(map);
        });
    }
    set locationInput(observable) {
        this.subscriptions.push(observable.subscribe((request) => {
            this.setLocation([request.lon, request.lat], request.zoomLevel);
            if (request.addMarker) {
                const transformedCoordinates = (0, proj_1.transform)([request.lon, request.lat], 'EPSG:4326', 'EPSG:3857');
                this.addMarker(transformedCoordinates);
            }
        }));
    }
    set height(height) {
        if (height) {
            this._height = height;
        }
    }
    updated(changedProps) {
        super.updated(changedProps);
        this.map$.pipe((0, rxjs_1.first)()).subscribe((map) => map.updateSize());
    }
    setLocation(coordinates, zoomLevel) {
        this.map$.pipe((0, rxjs_1.first)()).subscribe((map) => {
            map.setView(new View_1.default({
                projection: 'EPSG:3857',
                center: (0, proj_1.fromLonLat)(coordinates),
                zoom: zoomLevel || 12,
            }));
        });
    }
    disconnectedCallback() { }
    /**
     * USES EPSG:3857-coordinate system
     * */
    addMarker(coordinate) {
        this.map$.pipe((0, rxjs_1.first)()).subscribe(() => {
            if (this.currentMarker) {
                this.vectorSource.removeFeature(this.currentMarker);
            }
            this.currentMarker = new ol_1.Feature(new Point_1.default(coordinate));
            this.vectorSource.addFeature(this.currentMarker);
        });
    }
    dispatchLocationEvent(coordinate) {
        this.dispatchEvent(new CustomEvent('map-selected-location', {
            detail: {
                location: (0, proj_1.transform)(coordinate, 'EPSG:3857', 'EPSG:4326'),
            },
        }));
    }
    render() {
        return (0, lit_1.html) `
      <div style="height: ${this._height}px" id="map-target"></div>
    `;
    }
};
FlightlogMapComponent.styles = [map_component_styles_scss_1.default];
(0, tslib_1.__decorate)([
    (0, decorators_js_1.queryAsync)('#map-target'),
    (0, tslib_1.__metadata)("design:type", Promise)
], FlightlogMapComponent.prototype, "mapTarget", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Number)
], FlightlogMapComponent.prototype, "_height", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", rxjs_1.Observable),
    (0, tslib_1.__metadata)("design:paramtypes", [rxjs_1.Observable])
], FlightlogMapComponent.prototype, "locationInput", null);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Number),
    (0, tslib_1.__metadata)("design:paramtypes", [Number])
], FlightlogMapComponent.prototype, "height", null);
FlightlogMapComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)('flightlog-map'),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], FlightlogMapComponent);
exports.FlightlogMapComponent = FlightlogMapComponent;
//# sourceMappingURL=map.component.js.map