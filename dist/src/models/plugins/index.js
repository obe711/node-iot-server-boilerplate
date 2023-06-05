"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.toJSON = void 0;
var toJSON_plugin_1 = require("./toJSON.plugin");
Object.defineProperty(exports, "toJSON", { enumerable: true, get: function () { return __importDefault(toJSON_plugin_1).default; } });
var paginate_plugin_1 = require("./paginate.plugin");
Object.defineProperty(exports, "paginate", { enumerable: true, get: function () { return __importDefault(paginate_plugin_1).default; } });
