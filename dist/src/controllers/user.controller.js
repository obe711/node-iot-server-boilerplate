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
exports.userController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../utils/pick"));
const user_service_1 = require("../services/user.service");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Object.assign(req.body, { authType: 'email' });
    const user = yield user_service_1.userService.createUser(req.body);
    res.status(http_status_1.default.CREATED).send(user);
}));
const getUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, ['name', 'role']);
    const options = (0, pick_1.default)(req.query, ['sortBy', 'limit', 'page']);
    const search = (0, pick_1.default)(req.query, ['search']).search;
    const result = yield user_service_1.userService.queryUsers(filter, options, search);
    res.send(result);
}));
const getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getUserById(new mongoose_1.default.Types.ObjectId(req.params['userId']));
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    res.send(user);
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.updateUserById(new mongoose_1.default.Types.ObjectId(req.params['userId']), req.body);
    res.send(user);
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_service_1.userService.deleteUserById(new mongoose_1.default.Types.ObjectId(req.params['userId']));
    res.status(http_status_1.default.NO_CONTENT).send();
}));
// eslint-disable-next-line import/prefer-default-export
exports.userController = { createUser, getUsers, getUser, updateUser, deleteUser };
