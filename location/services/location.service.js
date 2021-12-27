"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationService = exports.LocationService = void 0;
const rxjs_1 = require("rxjs");
const loaction_http_service_1 = require("src/shared/services/loaction.http.service");
const FORBIDDEN_TYPES = ['senkning'];
class LocationService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    locationLookup(lat, lon) {
        return (0, rxjs_1.forkJoin)({
            info: this.httpService
                .pointSearch(lat, lon)
                .pipe((0, rxjs_1.mergeMap)((pointresponse) => this.httpService.locationDetailByLocationId(this.getLocationNumber(pointresponse.navn)))),
            elevation: this.httpService.getElevation(lat, lon),
        }).pipe((0, rxjs_1.tap)((a) => console.log(a)), (0, rxjs_1.map)((data) => ({
            name: data.info.navn[0].stedsnavn[0].skrivemåte,
            kommune: data.info.navn[0].kommuner[0].kommunenavn,
            fylke: data.info.navn[0].fylker[0].fylkesnavn,
            elevation: data.elevation,
            lat,
            lon,
        })));
    }
    getLocationNumber(locations) {
        if (locations.length > 1) {
            for (let i = 0; i < locations.length; i++) {
                if (FORBIDDEN_TYPES.some((type) => locations[i].navneobjekttype.toLowerCase() !== type.toLowerCase())) {
                    return locations[i].stedsnummer;
                }
            }
        }
        return locations[0].stedsnummer;
    }
}
exports.LocationService = LocationService;
exports.locationService = new LocationService(loaction_http_service_1.locationSearchHttpClient);
//# sourceMappingURL=location.service.js.map