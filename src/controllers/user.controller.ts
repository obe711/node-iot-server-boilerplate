import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import { userService } from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

const createUser = catchAsync(async (req: Request, res: Response) => {
  Object.assign(req.body, { authType: 'email' });
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const search: string = pick(req.query, ['search']).search as string;
  const result = await userService.queryUsers(filter, options, search);
  res.send(result);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['userId']));
  res.status(httpStatus.NO_CONTENT).send();
});

// eslint-disable-next-line import/prefer-default-export
export const userController = { createUser, getUsers, getUser, updateUser, deleteUser };
