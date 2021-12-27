"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationCreationService = exports.LocationCreationService = void 0;
const rxjs_1 = require("rxjs");
const location_backend_http_service_1 = require("./location-backend-http.service");
class LocationCreationService {
    constructor(locationBackendHttpService) {
        this.locationBackendHttpService = locationBackendHttpService;
        this.locations$ = [];
    }
    registerLocation(index) {
        if (!this.locations$[index]) {
            console.log('location was not found. Registered new');
            this.locations$[index] = new rxjs_1.BehaviorSubject(undefined);
        }
        return this.locations$[index];
    }
    getErrors$(index) {
        return this.locations$[index].pipe((0, rxjs_1.map)((location) => this.validateLocationInfo(location)));
    }
    /** Sets a location. Index=0 (default) is a start. All locations with a higher index is a landing */
    setStartLocation(location, index = 0) {
        this.locations$[index].next(location);
    }
    validateLocationInfo(location) {
        const result = [];
        if (location.elevation < 0) {
            result.push({
                field: 'elevation',
                message: 'Elevation must be greater than 0',
            });
        }
        if (!location.name) {
            result.push({ field: 'name', message: 'All locations must have a name' });
        }
        if (!location.kommune) {
            result.push({
                field: 'kommune',
                message: 'All locations must have a kommune',
            });
        }
        if (!location.fylke) {
            result.push({
                field: 'fylke',
                message: 'All locations must have a fylke',
            });
        }
        return result;
    }
}
exports.LocationCreationService = LocationCreationService;
exports.locationCreationService = new LocationCreationService(location_backend_http_service_1.locationBackendHttpService);
//# sourceMappingURL=location-creation.service.js.map