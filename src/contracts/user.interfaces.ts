import mongoose from 'mongoose';


export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  authType: string;
  role: string;
  isEmailVerified?: boolean;
_id: mongoose.Types.ObjectId;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  authType: string;
  role: string;
  isEmailVerified?: boolean;
_id: mongoose.Types.ObjectId;

}


export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  authType?: string;
  role?: string;
  isEmailVerified?: boolean;
}

