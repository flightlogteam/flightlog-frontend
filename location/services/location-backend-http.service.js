"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationBackendHttpService = exports.LocationBackendHttpService = void 0;
const authentication_service_1 = require("src/authentication/authentication.service");
class LocationBackendHttpService {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
}
exports.LocationBackendHttpService = LocationBackendHttpService;
exports.locationBackendHttpService = new LocationBackendHttpService(authentication_service_1.authenticationService);
//# sourceMappingURL=location-backend-http.service.js.map