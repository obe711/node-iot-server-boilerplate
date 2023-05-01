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
const { OAuth2Client } = require('google-auth-library');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const config = require('../config/config');
const logger = require('../config/logger');
// Google Oauth2
const client = new OAuth2Client(config.oauth.google.client_id);
/**
 * Verify Google Oauth2 token
 * @param {string} token
 * @returns {Promise<User>}
 */
const verifyOAuthToken = (token) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const ticket = yield client.verifyIdToken({
        idToken: token,
        audience: config.oauth.google.client_id,
      });
      const payload = ticket.getPayload();
      logger.info(JSON.stringify({ id: 'google data', payload }, null, 2));
      const user = yield userService.getUserByEmail(payload.email);
      if (!user) {
        const newUser = yield userService.createUser({
          firstName: payload.given_name,
          lastName: payload.family_name,
          email: payload.email,
          authType: 'google',
          role: 'user',
        });
        return newUser;
      }
      if (config.oauth.strictMode && user.authType !== 'google') throw Error('Not google user');
      return user;
    } catch (ex) {
      logger.info(JSON.stringify(ex, null, 2));
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user account');
    }
  });
module.exports = {
  verifyOAuthToken,
};
