"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = exports.CoreModule = exports.FlightLogApp = void 0;
const tslib_1 = require("tslib");
const flightlog_app_1 = require("./flightlog-app");
Object.defineProperty(exports, "FlightLogApp", { enumerable: true, get: function () { return flightlog_app_1.FlightLogApp; } });
const core_module_1 = (0, tslib_1.__importDefault)(require("./core/core.module"));
exports.CoreModule = core_module_1.default;
const shared_module_1 = (0, tslib_1.__importDefault)(require("./shared/shared.module"));
exports.SharedModule = shared_module_1.default;
//# sourceMappingURL=index.js.map