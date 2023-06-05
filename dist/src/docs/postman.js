"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi_to_postmanv2_1 = __importDefault(require("openapi-to-postmanv2"));
function convertOpenApiToPostman(openapiData) {
    return function (req, res, next) {
        openapi_to_postmanv2_1.default.convert({ type: 'json', data: openapiData }, {}, (err, conversionResult) => {
            if (!conversionResult.result) {
                next(conversionResult.reason);
            }
            else {
                res.send(conversionResult.output[0].data);
            }
        });
    };
}
exports.default = convertOpenApiToPostman;
