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
const axios = require('axios');
const NodeRSA = require('node-rsa');
const jsonwebtoken = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const logger = require('../config/logger');
const config = require('../config/config');

const _getApplePublicKeys = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    return axios
      .request({
        method: 'GET',
        url: 'https://appleid.apple.com/auth/keys',
      })
      .then((response) => response.data.keys);
  });
const getAppleUserId = (token) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const keys = yield _getApplePublicKeys();
    const decodedToken = jsonwebtoken.decode(token, { complete: true });
    const { kid } = decodedToken.header;
    const key = keys.find((k) => k.kid === kid);
    const pubKey = new NodeRSA();
    pubKey.importKey(
      {
        n: Buffer.from(key.n, 'base64'),
        e: Buffer.from(key.e, 'base64'),
      },
      'components-public'
    );
    const userkey = pubKey.exportKey(['public']);
    return jsonwebtoken.verify(token, userkey, {
      algorithms: 'RS256',
    });
  });
const verifyOAuthToken = (token, firstName, lastName) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const user = yield getAppleUserId(token);
      logger.info(JSON.stringify({ id: 'apple data', user }, null, 2));
      const foundUser = yield userService.getUserByEmail(user.email);
      if (!foundUser) {
        const newUser = yield userService.createUser({
          firstName: !firstName ? 'n/a' : firstName,
          lastName: !lastName ? 'n/a' : lastName,
          email: user.email,
          authType: 'apple',
          role: 'user',
        });
        return newUser;
      }
      if (config.oauth.strictMode && foundUser.authType !== 'apple') throw Error('Not apple user');
      return foundUser;
    } catch (ex) {
      logger.info(JSON.stringify(ex, null, 2));
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user account');
    }
  });
module.exports = {
  verifyOAuthToken,
};
