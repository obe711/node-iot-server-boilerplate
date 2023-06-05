"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../package.json");
const config_1 = require("../config/config");
const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'API documentation',
        version: package_json_1.version,
    },
    servers: [
        {
            url: `http://localhost:${config_1.config.port}/v1`,
        },
    ],
};
exports.default = swaggerDef;
