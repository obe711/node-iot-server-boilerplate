import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import faker from 'faker';
import User from '../../src/models/user.model';
import { ICreateUser } from '../../src/contracts/user.interfaces';

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne: ICreateUser = {
  _id: new mongoose.Types.ObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
  authType: 'email',
};

const userTwo: ICreateUser = {
  _id: new mongoose.Types.ObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
  authType: 'email',
};

const admin: ICreateUser = {
  _id: new mongoose.Types.ObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
  authType: 'email',
};

const insertUsers = async (users: ICreateUser[]) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

export {
  userOne,
  userTwo,
  admin,
  insertUsers,
};

