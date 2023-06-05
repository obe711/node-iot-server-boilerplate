"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("./custom.validation");
const createUser = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(custom_validation_1.password),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        role: joi_1.default.string().required().valid('user', 'admin'),
    }),
};
const getUsers = {
    query: joi_1.default.object().keys({
        firstName: joi_1.default.string(),
        lastName: joi_1.default.string(),
        role: joi_1.default.string(),
        search: joi_1.default.string().allow(''),
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const getUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const updateUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        email: joi_1.default.string().email(),
        password: joi_1.default.string().custom(custom_validation_1.password),
        firstName: joi_1.default.string(),
        lastName: joi_1.default.string(),
    })
        .min(1),
};
const deleteUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.userValidation = { createUser, getUsers, deleteUser, getUser, updateUser };
