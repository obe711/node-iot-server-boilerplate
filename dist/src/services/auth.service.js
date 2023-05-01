const __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = (email, password) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getUserByEmail(email);
    if (user && user.authType !== 'email') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (!user || !(yield user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  });
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = (refreshToken) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenDoc = yield Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    yield refreshTokenDoc.deleteOne();
  });
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = (refreshToken) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const refreshTokenDoc = yield tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = yield userService.getUserById(refreshTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      yield refreshTokenDoc.deleteOne();
      const tokens = yield tokenService.generateAuthTokens(user);
      return { user, tokens };
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  });
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = (resetPasswordToken, newPassword) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const resetPasswordTokenDoc = yield tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
      const user = yield userService.getUserById(resetPasswordTokenDoc.user);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
      }
      yield userService.updateUserById(user.id, { password: newPassword });
      yield Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
  });
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = (verifyEmailToken) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const verifyEmailTokenDoc = yield tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
      const user = yield userService.getUserById(verifyEmailTokenDoc.user);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
      }
      yield Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
      yield userService.updateUserById(user.id, { isEmailVerified: true });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
  });
module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
