import mongoose, { Model, Document, Schema } from 'mongoose';


export interface IUser  {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authType: string;
  role: string;
  isEmailVerified: boolean;
  //_id: mongoose.Types.ObjectId;
};

export interface IUserDocument extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}
export interface IUserModel extends Model<IUserDocument> {
  searchableFields(): string[];
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  toJSON: (arg0: Schema) => Promise<any>;
  paginate: (filter: Record<string, any>, options: Record<string, any>, search?: string) => Promise<object>;
}



export type UpdateUser = Partial<IUser>

export type RegisterUser = Omit<IUser, 'role' | 'isEmailVerified'>

export type CreateUser = Omit<IUser, 'isEmailVerified'>



