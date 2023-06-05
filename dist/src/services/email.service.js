"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
const transport = nodemailer_1.default.createTransport(config_1.config.email.smtp);
/* istanbul ignore next */
if (config_1.config.env !== 'test') {
    transport
        .verify()
        .then(() => logger_1.default.info('Connected to email server'))
        .catch(() => logger_1.default.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}
/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise<void>}
 */
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = { from: config_1.config.email.from, to, subject, text };
    yield transport.sendMail(msg);
});
/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendResetPasswordEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    yield sendEmail(to, subject, text);
});
/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendVerificationEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    yield sendEmail(to, subject, text);
});
exports.emailService = { transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail };
