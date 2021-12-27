"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationSearch = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
require("@vaadin/combo-box");
const location_search_component_styles_scss_1 = (0, tslib_1.__importDefault)(require("./location-search.component.styles.scss"));
const rxjs_1 = require("rxjs");
const loaction_http_service_1 = require("../../services/loaction.http.service");
/**
 *  EVENT: location-selected @type {Location}
 *
 * */
let LocationSearch = class LocationSearch extends lit_1.LitElement {
    constructor() {
        super();
        this.dataLoadSubject = new rxjs_1.Subject();
        this.label = 'Location';
        this.placeholder = 'location...';
        this.dataFetch = (search, 
        // eslint-disable-next-line
        callback) => {
            this.callback = callback;
            if (search.filter && search.filter.length > 0) {
                this.dataLoadSubject.next(search);
            }
        };
        this.comboElement.then((element) => {
            element.itemLabelPath = 'skrivemåte';
            element.itemIdPath = 'stedsnummer';
            element.renderer = (root, _, model) => {
                const location = model.item;
                root.innerHTML = `
        <div class="location">
          <b>${location.skrivemåte}</b><br>
          <p style="margin: 2px 0 2px 0" class="location-detail">${location.fylker[0]?.fylkesnavn || ''}, ${location.kommuner[0].kommunenavn}</p>
        </div>`;
            };
        });
        this.dataLoadSubject
            .pipe((0, rxjs_1.debounceTime)(200), (0, rxjs_1.mergeMap)((searchParams) => loaction_http_service_1.locationSearchHttpClient.locationSearch(searchParams.filter, searchParams.pageSize, searchParams.page)))
            .subscribe((data) => {
            if (this.callback) {
                this.callback(data.navn, data.navn.length);
            }
        });
    }
    render() {
        return (0, lit_1.html) `
      <p id="a"></p>
      <vaadin-combo-box
        @selected-item-changed="${this.valueChanged}"
        id="location-combo"
        placeholder="${this.placeholder}"
        label="${this.label}"
        .dataProvider="${this.dataFetch}"
      >
      </vaadin-combo-box>
    `;
    }
    valueChanged(event) {
        const location = event.detail.value;
        this.dispatchEvent(new CustomEvent('location-selected', { detail: location }));
    }
    connectedCallback() {
        super.connectedCallback();
    }
};
LocationSearch.styles = [location_search_component_styles_scss_1.default];
(0, tslib_1.__decorate)([
    (0, decorators_js_1.queryAsync)('#location-combo'),
    (0, tslib_1.__metadata)("design:type", Promise)
], LocationSearch.prototype, "comboElement", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], LocationSearch.prototype, "label", void 0);
(0, tslib_1.__decorate)([
    (0, decorators_js_1.property)(),
    (0, tslib_1.__metadata)("design:type", Object)
], LocationSearch.prototype, "placeholder", void 0);
LocationSearch = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)('location-search'),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], LocationSearch);
exports.LocationSearch = LocationSearch;
//# sourceMappingURL=location-search.component.js.map