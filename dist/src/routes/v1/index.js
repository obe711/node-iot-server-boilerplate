"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const docs_route_1 = __importDefault(require("./docs.route"));
const config_1 = require("../../config/config");
const router = express_1.default.Router();
const defaultRoutes = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/users',
        route: user_route_1.default,
    },
];
const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docs_route_1.default,
    },
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config_1.config.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}
exports.default = router;
