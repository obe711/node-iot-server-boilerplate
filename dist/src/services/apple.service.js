"use strict";
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
exports.appleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const axios_1 = __importDefault(require("axios"));
const node_rsa_1 = __importDefault(require("node-rsa"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const user_service_1 = require("./user.service");
const logger_1 = __importDefault(require("../config/logger"));
const config_1 = require("../config/config");
const _getApplePublicKeys = () => __awaiter(void 0, void 0, void 0, function* () {
    return axios_1.default
        .request({
        method: 'GET',
        url: 'https://appleid.apple.com/auth/keys',
    })
        .then((response) => response.data.keys);
});
const getAppleUserId = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = yield _getApplePublicKeys();
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Keys not found');
    }
    const decodedToken = jsonwebtoken_1.default.decode(token, { complete: true });
    if (!decodedToken) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Token not found');
    }
    const { kid } = decodedToken.header;
    const key = keys.find((k) => k.kid === kid);
    const pubKey = new node_rsa_1.default();
    pubKey.importKey({
        n: Buffer.from(key.n, 'base64'),
        e: Buffer.from(key.e, 'base64'),
    }, 'components-public');
    const userkey = pubKey.exportKey('public');
    return jsonwebtoken_1.default.verify(token, userkey, {
        algorithms: ['RS256'],
    });
});
const verifyOAuthToken = (token, firstName, lastName) => __awaiter(void 0, void 0, void 0, function* () {
    firstName = firstName || '';
    lastName = lastName || '';
    try {
        const user = yield getAppleUserId(token);
        logger_1.default.info(JSON.stringify({ id: 'apple data', user }, null, 2));
        const foundUser = yield user_service_1.userService.getUserByEmail(user.email);
        if (!foundUser) {
            const newUser = yield user_service_1.userService.createUser({
                firstName: !firstName ? 'n/a' : firstName,
                lastName: !lastName ? 'n/a' : lastName,
                email: user.email,
                authType: 'apple',
                role: 'user',
            });
            return newUser;
        }
        if (config_1.config.oauth.strictMode && foundUser.authType !== 'apple')
            throw Error('Not apple user');
        return foundUser;
    }
    catch (ex) {
        logger_1.default.info(JSON.stringify(ex, null, 2));
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid user account');
    }
});
exports.appleService = { verifyOAuthToken };
