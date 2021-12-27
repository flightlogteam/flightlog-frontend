"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightlogCreateLocationWhereComponent = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
require("src/shared/components/location-search/location-search.component");
const decorators_js_1 = require("lit/decorators.js");
const where_styles_scss_1 = (0, tslib_1.__importDefault)(require("./where.styles.scss"));
require("src/shared/components/map/map.component");
const rxjs_1 = require("rxjs");
require("@material/mwc-textfield");
require("@material/mwc-textarea");
const location_service_1 = require("src/location/services/location.service");
const mwc_textfield_1 = require("@material/mwc-textfield");
const location_creation_service_1 = require("src/location/services/location-creation.service");
let FlightlogCreateLocationWhereComponent = class FlightlogCreateLocationWhereComponent extends lit_1.LitElement {
    constructor() {
        super();
        this.subscriptions = [];
        this.locationIndex = 0;
        this.locationChangeSubject = new rxjs_1.Subject();
        this.mapHeight = 500;
        this.currentLocation$ = new rxjs_1.ReplaySubject(1);
        this.locationContainer.then((container) => {
            this.mapHeight = container.clientHeight - 100;
        });
    }
    tabIcon() {
        return 'place';
    }
    tabName() {
        return 'Start';
    }
    firstUpdated() {
        // Load existing data
        location_creation_service_1.locationCreationService
            .registerLocation(this.locationIndex)
            .pipe((0, rxjs_1.first)())
            .subscribe((info) => {
            if (info) {
                this.locationKommune.value = info.kommune;
                this.locationFylke.value = info.fylke;
                this.locationElevation.value = `${info.elevation}`;
                this.locationNameField.value = info.name;
                this.locationChangeSubject.next({
                    lat: info.lat,
                    lon: info.lon,
                    addMarker: true,
                });
            }
        });
        this.subscriptions.push((0, rxjs_1.merge)((0, rxjs_1.fromEvent)(this.locationNameField, 'input'), (0, rxjs_1.fromEvent)(this.locationElevation, 'input'), (0, rxjs_1.fromEvent)(this.locationKommune, 'input'), (0, rxjs_1.fromEvent)(this.locationFylke, 'input'), (0, rxjs_1.fromEvent)(this.locationShortDescription, 'input'), (0, rxjs_1.fromEvent)(this.locationDescription, 'input'), this.currentLocation$)
            .pipe((0, rxjs_1.debounceTime)(200), (0, rxjs_1.withLatestFrom)(this.currentLocation$))
            .subscribe(([_, currentLocation]) => {
            location_creation_service_1.locationCreationService.setStartLocation({
                name: this.locationNameField.value,
                elevation: Number.parseFloat(this.locationElevation.value),
                lat: currentLocation.lat,
                lon: currentLocation.lon,
                kommune: currentLocation.kommune,
                fylke: currentLocation.fylke,
            }, this.locationIndex);
        }));
        // Push new data
    }
    // Location selected in the location-search-component
    locationSelected(locationEvent) {
        this.locationChangeSubject.next({
            lat: locationEvent.detail.representasjonspunkt.nord,
            lon: locationEvent.detail.representasjonspunkt.øst,
        });
        this.dispatchEvent(new CustomEvent('location-selected', { detail: locationEvent.detail }));
    }
    disconnectedCallback() {
        console.log('Removing component from DOM');
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
    // Coordinates are delivered lon, lat
    mapSelectedLocation(coordinates) {
        const [lon, lat] = coordinates.detail.location;
        location_service_1.locationService.locationLookup(lat, lon).subscribe((location) => {
            this.currentLocation$.next(location);
            this.locationNameField.value = location.name;
            this.locationElevation.value = `${location.elevation}`;
            this.locationKommune.value = location.kommune;
            this.locationFylke.value = location.fylke;
        });
    }
    render() {
        return (0, lit_1.html) `
      <div class="location">
        <div class="location-selection">
          <location-search
            label="Where is the start"
            placeholder="address, mountain, kommune, area..."
            class="search-box"
            id="test"
            @location-selected="${this.locationSelected}"
          ></location-search>
          <flightlog-map
            .height=${this.mapHeight}
            @map-selected-location=${this.mapSelectedLocation}
            .locationInput=${this.locationChangeSubject}
          ></flightlog-map>
        </div>
        <div class="information" id="information-container">
          <h3>Details</h3>
          <mwc-textfield
            id="location-name"
            label="Location Name"
            outlined
          ></mwc-textfield>
          <mwc-textfield
            id="location-elevation"
            label="Elevation"
            outlined
            suffix="meters"
            type="number"
          ></mwc-textfield>
          <mwc-textfield
            id="location-fylke"
            label="Fylke"
            outlined
          ></mwc-textfield>
          <mwc-textfield
            id="location-kommune"
            label="Kommune"
            outlined
          ></mwc-textfield>
          <mwc-textarea
            id="location-short-description"
            placeholder="Who should fly here?"
            outlined
            label="Short description"
            rows="3"
          ></mwc-textarea>
          <mwc-textarea
            id="location-description"
            placeholder="Describe conditions, payment to the land owner etc"
            outlined
            label="Description"
            rows="10"
          ></mwc-textarea>
        </div>
      </div>
    `;
    }
};
FlightlogCreateLocationWhereComponent.styles = [where_styles_scss_1.default];
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], FlightlogCreateLocationWhereComponent.prototype, "locationIndex", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)('#location-name'),
    (0, tslib_1.__metadata)("design:type", mwc_textfield_1.TextField)
], FlightlogCreateLocationWhereComponent.prototype, "locationNameField", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)('#location-elevation'),
    (0, tslib_1.__metadata)("design:type", mwc_textfield_1.TextField)
], FlightlogCreateLocationWhereComponent.prototype, "locationElevation", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)('#location-fylke'),
    (0, tslib_1.__metadata)("design:type", mwc_textfield_1.TextField)
], FlightlogCreateLocationWhereComponent.prototype, "locationFylke", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.queryAsync)('#information-container'),
    (0, tslib_1.__metadata)("design:type", Promise)
], FlightlogCreateLocationWhereComponent.prototype, "locationContainer", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)('#location-kommune'),
    (0, tslib_1.__metadata)("design:type", mwc_textfield_1.TextField)
], FlightlogCreateLocationWhereComponent.prototype, "locationKommune", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)('#location-short-description'),
    (0, tslib_1.__metadata)("design:type", mwc_textfield_1.TextField)
], FlightlogCreateLocationWhereComponent.prototype, "locationShortDescription", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)('#location-description'),
    (0, tslib_1.__metadata)("design:type", mwc_textfield_1.TextField)
], FlightlogCreateLocationWhereComponent.prototype, "locationDescription", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.state)(),
    (0, tslib_1.__metadata)("design:type", Object)
], FlightlogCreateLocationWhereComponent.prototype, "mapHeight", void 0);
FlightlogCreateLocationWhereComponent = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)('flightlog-create-location'),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], FlightlogCreateLocationWhereComponent);
exports.FlightlogCreateLocationWhereComponent = FlightlogCreateLocationWhereComponent;
//# sourceMappingURL=where.js.map