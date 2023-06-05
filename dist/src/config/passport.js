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
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("./config");
const tokens_1 = require("./tokens");
const models_1 = require("../models");
const jwtOptions = {
    secretOrKey: config_1.config.jwt.secret,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload.type !== tokens_1.tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }
        const user = yield models_1.User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
});
const jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, jwtVerify);
exports.jwtStrategy = jwtStrategy;
