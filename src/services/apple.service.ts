import httpStatus from 'http-status';
import axios from 'axios';
import NodeRSA from 'node-rsa';
import jsonwebtoken from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import { userService } from './user.service';
import logger from '../config/logger';
import {config} from '../config/config';
import { IUserDocument } from '../contracts/user.interfaces';

const _getApplePublicKeys = async () => {
  return axios
    .request({
      method: 'GET',
      url: 'https://appleid.apple.com/auth/keys',
    })
    .then((response) => response.data.keys);
};

const getAppleUserId = async (token:string) => {
  const keys = await _getApplePublicKeys();
  if (!keys || !Array.isArray(keys) || keys.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Keys not found');
  }
  const decodedToken = jsonwebtoken.decode(token, { complete: true });
  if (!decodedToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  } 
  const { kid  } = decodedToken.header;
  const key = keys.find((k) => k.kid === kid);


  const pubKey = new NodeRSA();
  pubKey.importKey(
    {
      n: Buffer.from(key.n, 'base64'),
      e: Buffer.from(key.e, 'base64'),
    },
    'components-public'
  );

  const userkey = pubKey.exportKey('public');

  return jsonwebtoken.verify(token, userkey, {
    algorithms: ['RS256'],
  });
};

const verifyOAuthToken = async (token: string, firstName?: string, lastName?: string) => {
  firstName = firstName || '';
  lastName = lastName || '';
  try {
    const user  = await getAppleUserId(token) as IUserDocument

    logger.info(JSON.stringify({ id: 'apple data', user }, null, 2));

     const foundUser = await userService.getUserByEmail(user.email);
    if (!foundUser) {
      const newUser = await userService.createUser({
        firstName: !firstName ? 'n/a' : firstName,
        lastName: !lastName ? 'n/a' : lastName,
        email: user.email,
        authType: 'apple',
        role: 'user',
       
      }) 
      return newUser;
    }
    if (config.oauth.strictMode && foundUser.authType !== 'apple') throw Error('Not apple user');
    return foundUser;
  } catch (ex) {
    logger.info(JSON.stringify(ex, null, 2));
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user account');
  }
};

export const appleService =  { verifyOAuthToken };

