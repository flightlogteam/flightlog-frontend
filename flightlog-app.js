"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightLogApp = void 0;
const tslib_1 = require("tslib");
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const application_styles_scss_1 = (0, tslib_1.__importDefault)(require("./shared/styles/application.styles.scss"));
const flightlog_app_styles_scss_1 = (0, tslib_1.__importDefault)(require("./flightlog-app.styles.scss"));
const metadata_1 = require("pwa-helpers/metadata");
const authentication_service_1 = require("./authentication/authentication.service");
const navigation_service_1 = require("./shared/services/navigation.service");
let FlightLogApp = class FlightLogApp extends lit_1.LitElement {
    constructor() {
        super();
        this.subscriptions = [];
        this.currentRoute = navigation_service_1.navigationService.currentRoute;
        console.log(authentication_service_1.authenticationService);
        this.subscriptions.push(navigation_service_1.navigationService.currentRoute$.subscribe((route) => {
            this.currentRoute = route;
            this.loadView();
            (0, metadata_1.updateMetadata)({
                title: `Flightlog - ${route.name}`,
                description: `Flightlog is the next generation free flight logging tool`,
            });
        }));
        this.loadView();
    }
    async loadView() {
        if (this.currentRoute.action) {
            try {
                const component = await this.currentRoute.action();
                if (this.viewContainer) {
                    this.viewContainer.innerHTML = "";
                    // The object only have one key and we should construct that element
                    for (const key of Object.keys(component)) {
                        const element = component[key];
                        this.viewContainer.appendChild(new element());
                    }
                }
            }
            catch (e) {
                console.error(`unable to load view: ${e}`);
            }
        }
    }
    render() {
        return (0, lit_1.html) `
      <flightlog-toolbar-component></flightlog-toolbar-component>
      <div id="view-container"></div>
      <core-footer></core-footer>
    `;
    }
};
FlightLogApp.styles = [application_styles_scss_1.default, flightlog_app_styles_scss_1.default];
(0, tslib_1.__decorate)([
    (0, decorators_js_1.query)("#view-container"),
    (0, tslib_1.__metadata)("design:type", HTMLDivElement)
], FlightLogApp.prototype, "viewContainer", void 0);
FlightLogApp = (0, tslib_1.__decorate)([
    (0, decorators_js_1.customElement)("flightlog-app"),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], FlightLogApp);
exports.FlightLogApp = FlightLogApp;
//# sourceMappingURL=flightlog-app.js.map