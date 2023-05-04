import mongoose from 'mongoose';
import { Request } from 'express';

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  authType: string;
  role: string;
  isEmailVerified?: boolean;
_id: mongoose.Types.ObjectId;
};


export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  authType?: string;
  role?: string;
  isEmailVerified?: boolean;
}

export interface UserRequest extends Request {
  user: object;

}
