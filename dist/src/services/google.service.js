"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleService = void 0;
const httpStatus = __importStar(require("http-status"));
const google_auth_library_1 = require("google-auth-library");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const user_service_1 = require("./user.service");
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
// Google Oauth2
const client = new google_auth_library_1.OAuth2Client(config_1.config.oauth.google.client_id);
/**
 * Verify Google Oauth2 token
 * @param {string} token
 * @returns {Promise<IUserDocument>}
 */
const verifyOAuthToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: config_1.config.oauth.google.client_id,
        });
        const payload = ticket.getPayload();
        if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
            throw new ApiError_1.default(httpStatus.NOT_FOUND, 'payload not found');
        }
        logger_1.default.info(JSON.stringify({ id: 'google data', payload }, null, 2));
        const user = yield user_service_1.userService.getUserByEmail(payload.email);
        if (!user) {
            const newUser = yield user_service_1.userService.createUser({
                firstName: !payload.given_name ? 'n/a' : payload.given_name,
                lastName: !payload.family_name ? 'n/a' : payload.family_name,
                email: payload.email,
                authType: 'google',
                role: 'user',
            });
            return newUser;
        }
        if (config_1.config.oauth.strictMode && user.authType !== 'google')
            throw Error('Not google user');
        return user;
    }
    catch (ex) {
        logger_1.default.info(JSON.stringify(ex, null, 2));
        throw new ApiError_1.default(httpStatus.UNAUTHORIZED, 'Invalid user account');
    }
});
exports.googleService = {
    verifyOAuthToken,
};
