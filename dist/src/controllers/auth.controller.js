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
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const {
  authService,
  userService,
  tokenService,
  emailService,
  cookieService,
  appleService,
  googleService,
} = require('../services');

const register = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    Object.assign(req.body, { authType: 'email' });
    const user = yield userService.createUser(req.body);
    const tokens = yield tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  })
);
const loginEmail = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield authService.loginUserWithEmailAndPassword(email, password);
    const tokens = yield tokenService.generateAuthTokens(user);
    cookieService.setTokenCookie(res, tokens.refresh);
    res.send({ user, tokens });
  })
);
// loginGoogle
const loginGoogle = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield googleService.verifyOAuthToken(req.body.token);
    const tokens = yield tokenService.generateAuthTokens(user);
    cookieService.setTokenCookie(res, tokens.refresh);
    res.send({ user, tokens });
  })
);
// loginApple
const loginApple = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield appleService.verifyOAuthToken(req.body.token);
    const tokens = yield tokenService.generateAuthTokens(user);
    cookieService.setTokenCookie(res, tokens.refresh);
    res.send({ user, tokens });
  })
);
const logout = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield authService.logout(req.body.refreshToken);
    cookieService.expireTokenCookie(res);
    res.status(httpStatus.NO_CONTENT).send();
  })
);
const refreshTokens = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { user, tokens } = yield authService.refreshAuth(
      req.cookies[config.jwt.refreshCookieName] || req.body.refreshToken
    );
    cookieService.setTokenCookie(res, tokens.refresh);
    res.send({ user, tokens });
  })
);
const forgotPassword = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = yield tokenService.generateResetPasswordToken(req.body.email);
    yield emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  })
);
const resetPassword = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield authService.resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  })
);
const sendVerificationEmail = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const verifyEmailToken = yield tokenService.generateVerifyEmailToken(req.user);
    yield emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
  })
);
const verifyEmail = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield authService.verifyEmail(req.query.token);
    res.status(httpStatus.NO_CONTENT).send();
  })
);
module.exports = {
  register,
  loginEmail,
  loginApple,
  loginGoogle,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
