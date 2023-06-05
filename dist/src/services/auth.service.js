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
exports.authService = exports.verifyEmail = exports.resetPassword = exports.refreshAuth = exports.logout = exports.loginUserWithEmailAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const token_service_1 = require("./token.service");
const user_service_1 = require("./user.service");
const token_model_1 = __importDefault(require("../models/token.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const tokens_1 = require("../config/tokens");
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getUserByEmail(email);
    if (user && user.authType !== 'email') {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (!user || !(yield user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
});
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenDoc = yield token_model_1.default.findOne({ token: refreshToken, type: tokens_1.tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found');
    }
    yield refreshTokenDoc.deleteOne();
});
exports.logout = logout;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshTokenDoc = yield token_service_1.tokenService.verifyToken(refreshToken, tokens_1.tokenTypes.REFRESH);
        const user = yield user_service_1.userService.getUserById(new mongoose_1.default.Types.ObjectId(refreshTokenDoc.user));
        if (!user) {
            throw new Error();
        }
        yield token_model_1.default.deleteOne({ _id: refreshTokenDoc.user });
        const tokens = yield token_service_1.tokenService.generateAuthTokens(user);
        return { user, tokens };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
    }
});
exports.refreshAuth = refreshAuth;
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = (resetPasswordToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resetPasswordTokenDoc = yield token_service_1.tokenService.verifyToken(resetPasswordToken, tokens_1.tokenTypes.RESET_PASSWORD);
        const user = yield user_service_1.userService.getUserById(new mongoose_1.default.Types.ObjectId(resetPasswordTokenDoc.user));
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
        }
        yield user_service_1.userService.updateUserById(user.id, { password: newPassword });
        yield token_model_1.default.deleteMany({ user: user.id, type: tokens_1.tokenTypes.RESET_PASSWORD });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
    }
});
exports.resetPassword = resetPassword;
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = (verifyEmailToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyEmailTokenDoc = yield token_service_1.tokenService.verifyToken(verifyEmailToken, tokens_1.tokenTypes.VERIFY_EMAIL);
        const user = yield user_service_1.userService.getUserById(new mongoose_1.default.Types.ObjectId(verifyEmailTokenDoc.user));
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email verification failed');
        }
        yield token_model_1.default.deleteMany({ user: user.id, type: tokens_1.tokenTypes.VERIFY_EMAIL });
        yield user_service_1.userService.updateUserById(user.id, { isEmailVerified: true });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email verification failed');
    }
});
exports.verifyEmail = verifyEmail;
exports.authService = {
    loginUserWithEmailAndPassword: exports.loginUserWithEmailAndPassword,
    logout: exports.logout,
    refreshAuth: exports.refreshAuth,
    resetPassword: exports.resetPassword,
    verifyEmail: exports.verifyEmail,
};
