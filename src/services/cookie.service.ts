import { Response } from 'express';
import config from '../config/config';

interface TokenData {
  expires: string;
  token: string;
}

/**
 * Set Token Cookie
 * @param {Response<object>} res
 * @param {object} tokenData
 */
const setTokenCookie = (res: Response<object>, tokenData: TokenData): void => {
  const { expires, token } = tokenData;
  const cookieRefreshOptions = {
    httpOnly: true,
    expires: new Date(expires),
  };
  res.cookie(config.jwt.refreshCookieName, token, cookieRefreshOptions);
};

/**
 * Expire Token Cookie
 * @param {Response<object>} res
 */
const expireTokenCookie = (res: Response<object>): void => {
  const expireCookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() - 60 * 1000 * 60 * 24 * 31),
  };
  res.cookie(config.jwt.refreshCookieName, 'x', expireCookieOptions);
};

export const cookieService = {
  setTokenCookie,
  expireTokenCookie,
};

