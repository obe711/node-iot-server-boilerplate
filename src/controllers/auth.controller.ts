import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import config from '../config/config';
import {
  authService,
  userService,
  tokenService,
  emailService,
  cookieService,
  appleService,
  googleService,
} from '../services';

const register = catchAsync(async (req: Request, res: Response) => {
  Object.assign(req.body, { authType: 'email' });
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const loginEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  cookieService.setTokenCookie(res, tokens.refresh);
  res.send({ user, tokens });
});

const loginGoogle = catchAsync(async (req: Request, res: Response) => {
  const user = await googleService.verifyOAuthToken(req.body.token);
  const tokens = await tokenService.generateAuthTokens(user);
  cookieService.setTokenCookie(res, tokens.refresh);
  res.send({ user, tokens });
});

const loginApple = catchAsync(async (req: Request, res: Response) => {
  const user = await appleService.verifyOAuthToken(req.body.token);
  const tokens = await tokenService.generateAuthTokens(user);
  cookieService.setTokenCookie(res, tokens.refresh);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  cookieService.expireTokenCookie(res);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.refreshAuth(
    req.cookies[config.jwt.refreshCookieName] || req.body.refreshToken
  );
  cookieService.setTokenCookie(res, tokens.refresh);
  res.send({ user, tokens });
});


 

