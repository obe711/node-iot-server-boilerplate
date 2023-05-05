import * as httpStatus from 'http-status';
import { OAuth2Client } from 'google-auth-library';
import ApiError from '../utils/ApiError';
import {userService} from './user.service';
import {config} from '../config/config';
import logger from '../config/logger';
import { IUser } from '../contracts/user.interfaces';

// Google Oauth2
const client = new OAuth2Client(config.oauth.google.client_id);

/**
 * Verify Google Oauth2 token
 * @param {string} token
 * @returns {Promise<IUser>}
 */
const verifyOAuthToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.oauth.google.client_id,
    });

    const payload = ticket.getPayload();
    if(!payload?.email) {
      throw new ApiError(httpStatus.NOT_FOUND, 'payload not found');
    }


    logger.info(JSON.stringify({ id: 'google data', payload }, null, 2));
    const user = await userService.getUserByEmail(payload.email) as IUser;
    if (!user) {
      const newUser = await userService.createUser({
        firstName: !payload.given_name ? 'n/a' : payload.given_name,
        lastName: !payload.family_name ? 'n/a' : payload.family_name,
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
};

export const googleService = {
  verifyOAuthToken,
};

