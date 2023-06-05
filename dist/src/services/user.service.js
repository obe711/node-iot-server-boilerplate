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
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = (userBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield models_1.User.isEmailTaken(userBody.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    return models_1.User.create(userBody);
});
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} search - Text string to search in search fields
 * @returns {Promise<QueryResult>}
 */
const queryUsers = (filter, options, search) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.paginate(filter, options, search);
    return users;
});
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.User.findById(id);
});
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.User.findOne({ email });
});
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = (userId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (yield models_1.User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    yield user.save();
    return user;
});
/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield user.deleteOne();
    return user;
});
// eslint-disable-next-line import/prefer-default-export
exports.userService = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
