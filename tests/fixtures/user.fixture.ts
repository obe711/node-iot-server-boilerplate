import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import faker from 'faker';
import User from '../../src/models/user.model';
import { IUserTest } from '../../src/contracts/user.interfaces';

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne: IUserTest = {
  _id: new mongoose.Types.ObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
  authType: 'email',
};

const userTwo: IUserTest = {
  _id: new mongoose.Types.ObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
  authType: 'email',
};

const admin: IUserTest = {
  _id: new mongoose.Types.ObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
  authType: 'email',
};

const insertUsers = async (users: IUserTest[]) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

export {
  userOne,
  userTwo,
  admin,
  insertUsers,
};

