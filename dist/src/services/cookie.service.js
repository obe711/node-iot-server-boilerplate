"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieService = void 0;
const config_1 = require("../config/config");
/**
 * Set Token Cookie
 * @param {Response<object>} res
 * @param {object} tokenData
 */
const setTokenCookie = (res, tokenData) => {
    const { expires, token } = tokenData;
    const cookieRefreshOptions = {
        httpOnly: true,
        expires: new Date(expires),
    };
    res.cookie(config_1.config.jwt.refreshCookieName, token, cookieRefreshOptions);
};
/**
 * Expire Token Cookie
 * @param {Response<object>} res
 */
const expireTokenCookie = (res) => {
    const expireCookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() - 60 * 1000 * 60 * 24 * 31),
    };
    res.cookie(config_1.config.jwt.refreshCookieName, 'x', expireCookieOptions);
};
exports.cookieService = {
    setTokenCookie,
    expireTokenCookie,
};
