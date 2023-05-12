import Joi from 'joi';
import { password } from './custom.validation';

interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface OauthLoginParams {
  oauth: 'google' | 'apple';
}

interface OauthLoginBody {
  firstName: string;
  lastName: string;
  token: string;
}

interface LogoutBody {
  refreshToken: string;
}

interface RefreshTokensBody {
  refreshToken: string;
}

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordQuery {
  token: string;
}

interface ResetPasswordBody {
  password: string;
}

interface VerifyEmailQuery {
  token: string;
}

const register = {
  body: Joi.object<RegisterBody>({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

 const login = {
  body: Joi.object<LoginBody>({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const oauthLogin = {
  params: Joi.object<OauthLoginParams>({
    oauth: Joi.string().valid('google', 'apple').required(),
  }),
  body: Joi.object<OauthLoginBody>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    token: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object<LogoutBody>({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object<RefreshTokensBody>({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object<ForgotPasswordBody>({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object<ResetPasswordQuery>({
    token: Joi.string().required(),
  }),
  body: Joi.object<ResetPasswordBody>({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object<VerifyEmailQuery>({
    token: Joi.string().required(),
  }),
};

export const authValidation =  {  
  register,
  login,
  oauthLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail 
}
