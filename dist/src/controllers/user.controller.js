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
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    Object.assign(req.body, { authType: 'email' });
    const user = yield userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  })
);
const getUsers = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const { search } = pick(req.query, ['search']);
    const result = yield userService.queryUsers(filter, options, search);
    res.send(result);
  })
);
const getUser = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  })
);
const updateUser = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.updateUserById(req.params.userId, req.body);
    res.send(user);
  })
);
const deleteUser = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
  })
);
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
