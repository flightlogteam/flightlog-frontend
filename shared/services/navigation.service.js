"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigationService = exports.NavigationService = exports.createNavigation = void 0;
const rxjs_1 = require("rxjs");
function createNavigation() {
    return [
        {
            name: "Dashboard",
            icon: "dashboard",
            route: "/",
            navigation: true,
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/dashboard")));
            },
        },
        {
            name: "Pilots",
            icon: "people",
            route: "/users",
            navigation: true,
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/users")));
            },
        },
        {
            name: "New flight",
            icon: "add_circle",
            route: "/flights/new",
            navigation: false,
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/flights/newflight")));
            },
        },
        {
            name: "Flights",
            icon: "flight_takeoff",
            route: "/flights",
            navigation: true,
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/flights/flights")));
            },
        },
        {
            name: "Locations",
            icon: "place",
            route: "/locations",
            navigation: true,
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/locations/locations")));
            },
        },
        {
            name: "Create Location",
            icon: "place",
            route: "/locations/create",
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/locations/create-location/create-location.component")));
            },
        },
        {
            name: "Unauthorized",
            route: "/401",
            icon: "401",
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/401")));
            },
        },
        {
            name: "Not found",
            route: "/404",
            icon: "404",
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/404")));
            },
        },
        {
            name: "Callback",
            route: "/callback",
            icon: "404",
            action: () => {
                return Promise.resolve().then(() => __importStar(require("../../views/callback")));
            },
        },
    ];
}
exports.createNavigation = createNavigation;
class NavigationService {
    constructor() {
        this.routes = createNavigation();
        this.routeSubject = new rxjs_1.ReplaySubject(1);
        const initialPath = window.location.pathname;
        const initialRoute = this.routes.find((route) => route.route === initialPath);
        if (initialRoute) {
            this._currentRoute = initialRoute;
        }
        else {
            const route = this.routes.find((item) => item.route === "/");
            if (route === null) {
                throw new Error("Unable to find default route");
            }
            this._currentRoute = route;
        }
        this.currentRoute$.subscribe((route) => {
            this._currentRoute = route;
        });
    }
    /**
     * Only for edge cases. Use the observable as often as possible
     * */
    get currentRoute() {
        return this._currentRoute;
    }
    get currentRoute$() {
        return this.routeSubject;
    }
    get mainNavigation$() {
        return (0, rxjs_1.of)(this.routes.filter((route) => route.navigation === true));
    }
    setCurrentRoute(path, state = null) {
        history.replaceState(state, "", path);
        this.changeNavigation(window.location);
    }
    changeNavigation(location) {
        const view = this.findMatchingRoute(location);
        this.routeSubject.next(view);
    }
    findMatchingRoute(location) {
        for (const item of this.routes) {
            if (item.route === location.pathname) {
                return item;
            }
        }
        const notFound = this.routes.find((item) => item.route === "/404");
        return notFound;
    }
}
exports.NavigationService = NavigationService;
exports.navigationService = new NavigationService();
//# sourceMappingURL=navigation.service.js.map