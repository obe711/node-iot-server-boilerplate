"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("./custom.validation");
const register = {
    body: joi_1.default.object({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(custom_validation_1.password),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
    }),
};
const login = {
    body: joi_1.default.object({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
};
const oauthLogin = {
    params: joi_1.default.object({
        oauth: joi_1.default.string().valid('google', 'apple').required(),
    }),
    body: joi_1.default.object({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        token: joi_1.default.string().required(),
    }),
};
const logout = {
    body: joi_1.default.object({
        refreshToken: joi_1.default.string().required(),
    }),
};
const refreshTokens = {
    body: joi_1.default.object({
        refreshToken: joi_1.default.string().required(),
    }),
};
const forgotPassword = {
    body: joi_1.default.object({
        email: joi_1.default.string().email().required(),
    }),
};
const resetPassword = {
    query: joi_1.default.object({
        token: joi_1.default.string().required(),
    }),
    body: joi_1.default.object({
        password: joi_1.default.string().required().custom(custom_validation_1.password),
    }),
};
const verifyEmail = {
    query: joi_1.default.object({
        token: joi_1.default.string().required(),
    }),
};
exports.authValidation = {
    register,
    login,
    oauthLogin,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail
};
