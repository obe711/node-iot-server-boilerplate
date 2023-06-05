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
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("../config/config");
const services_1 = require("../services");
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const tokens_1 = require("../config/tokens");
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config_1.config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = (token, userId, expires, type, blacklisted = false) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDoc = yield models_1.Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
});
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
    if (typeof payload.sub !== 'string') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'bad user');
    }
    const tokenDoc = yield models_1.Token.findOne({ token, type, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
});
/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user._id.toString(), accessTokenExpires, tokens_1.tokenTypes.ACCESS);
    const refreshTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user._id.toString(), refreshTokenExpires, tokens_1.tokenTypes.REFRESH);
    yield saveToken(refreshToken, user._id.toString(), refreshTokenExpires, tokens_1.tokenTypes.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
});
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No users found with this email');
    }
    const expires = (0, moment_1.default)().add(config_1.config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokens_1.tokenTypes.RESET_PASSWORD);
    yield saveToken(resetPasswordToken, user.id, expires, tokens_1.tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
});
/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = (0, moment_1.default)().add(config_1.config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user._id.toString(), expires, tokens_1.tokenTypes.VERIFY_EMAIL);
    yield saveToken(verifyEmailToken, user._id.toString(), expires, tokens_1.tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
});
exports.tokenService = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
};
