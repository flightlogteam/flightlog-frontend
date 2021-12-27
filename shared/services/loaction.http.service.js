"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationSearchHttpClient = exports.LocationSearchHttpClient = void 0;
const ajax_1 = require("rxjs/ajax");
const operators_1 = require("rxjs/operators");
class LocationSearchHttpClient {
    locationSearch(text, pageSize, page) {
        return (0, ajax_1.ajax)({
            url: `https://ws.geonorge.no/stedsnavn/v1/navn?sok=${text}&fuzzy=true&utkoordsys=4258&treffPerSide=${pageSize}&side=${page + 1}`,
            crossDomain: true,
            method: 'GET',
        }).pipe((0, operators_1.map)((item) => item.response));
    }
    locationDetailByLocationId(stedsnummer) {
        return (0, ajax_1.ajax)({
            url: `https://ws.geonorge.no/stedsnavn/v1/sted?stedsnummer=${stedsnummer}&utkoordsys=4258&treffPerSide=10&side=1`,
            crossDomain: true,
            method: 'GET',
        }).pipe((0, operators_1.map)((item) => item.response));
    }
    pointSearch(lat, lon) {
        return (0, ajax_1.ajax)({
            url: `https://ws.geonorge.no/stedsnavn/v1/punkt?nord=${lat}&ost=${lon}&koordsys=4326&radius=500&utkoordsys=4258&treffPerSide=10&side=1`,
            crossDomain: true,
            method: 'GET',
        }).pipe((0, operators_1.map)((item) => item.response));
    }
    getElevation(lat, lon) {
        return (0, ajax_1.ajax)({
            url: `https://ws.geonorge.no/hoydedata/v1/punkt?nord=${lat}&koordsys=4326&ost=${lon}&geojson=false`,
            crossDomain: true,
            method: 'GET',
        }).pipe((0, operators_1.map)((item) => item.response.punkter[0].z));
    }
}
exports.LocationSearchHttpClient = LocationSearchHttpClient;
exports.locationSearchHttpClient = new LocationSearchHttpClient();
//# sourceMappingURL=loaction.http.service.js.map