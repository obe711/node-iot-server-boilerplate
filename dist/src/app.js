"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("./config/config");
const morgan_1 = require("./config/morgan");
const passport_2 = require("./config/passport");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const v1_1 = __importDefault(require("./routes/v1"));
const error_1 = require("./middlewares/error");
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const app = (0, express_1.default)();
if (config_1.config.env !== 'test') {
    app.use(morgan_1.morganHandlers.successHandler);
    app.use(morgan_1.morganHandlers.errorHandler);
}
// set security HTTP headers
app.use((0, helmet_1.default)());
// parse json request body
app.use(express_1.default.json());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// parse cookies
app.use((0, cookie_parser_1.default)());
// sanitize request data
app.use((0, xss_clean_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
// gzip compression
app.use((0, compression_1.default)());
// enable cors
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
// jwt authentication
app.use(passport_1.default.initialize());
passport_1.default.use('jwt', passport_2.jwtStrategy);
// limit repeated failed requests to auth endpoints
if (config_1.config.env === 'production') {
    app.use('/v1/auth', rateLimiter_1.authLimiter);
}
// v1 api routes
app.use('/v1', v1_1.default);
// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
    next(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(error_1.errorConverter);
// handle error
app.use(error_1.errorHandler);
exports.default = app;
