import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvVars {
  NODE_ENV: 'production' | 'development' | 'test';
  PORT: number;
  MONGODB_URL: string;
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRATION_MINUTES: number;
  JWT_REFRESH_EXPIRATION_DAYS: number;
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: number;
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: number;
  JWT_REFRESH_COOKIE: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USERNAME?: string;
  SMTP_PASSWORD?: string;
  EMAIL_FROM?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  AUTH_STRICT_MODE?: boolean;
}

const envVarsSchema = Joi.object<EnvVars>({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
    .default(10)
    .description('minutes after which reset password token expires'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
    .default(10)
    .description('minutes after which verify email token expires'),
  JWT_REFRESH_COOKIE: Joi.string().description('Name of refresh token cookie'),
  SMTP_HOST: Joi.string().description('server that will send the emails'),
  SMTP_PORT: Joi.number().description('port to connect to the email server'),
  SMTP_USERNAME: Joi.string().description('username for email server'),
  SMTP_PASSWORD: Joi.string().description('password for email server'),
  EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  GOOGLE_CLIENT_ID: Joi.string().description('Google Client ID for Oauth2'),
  GOOGLE_CLIENT_SECRET: Joi.string().description('Google Client Secret for Oauth2'),
  AUTH_STRICT_MODE: Joi.bool().description('Allow users to login from multi auth sources'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    refreshCookieName: envVars.JWT_REFRESH_COOKIE,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  oauth: {
    strictMode: envVars.AUTH_STRICT_MODE,
    google: {
      client_id: envVars.GOOGLE_CLIENT_ID,
      client_secret: envVars.GOOGLE_CLIENT_SECRET,
    },
  },
};
 
