import mongoose, { Model, Schema, model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins';
import { roles } from '../config/roles';
import authTypes from '../config/authTypes';

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authType: string;
  role: string;
  isEmailVerified: boolean;

}

// interface IUserMethods {
//   isPasswordMatch(password: string): Promise<boolean>;
// }

interface IUserDocument extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

// interface IUserModel extends Model<IUser, {}, IUserMethods> {
//   searchableFields(): string[];
//   isEmailTaken(email: string, excludeUserId: mongoose.Types.ObjectId): Promise<boolean>;
//   toJSON: (arg0: Schema) => Promise<any>;
//   paginate: (filter: object, options: object, search?: string) => Promise<object>;
// }

interface IUserModel extends Model<IUserDocument> {
  searchableFields(): string[];
  isEmailTaken(email: string, excludeUserId: mongoose.Types.ObjectId): Promise<boolean>;
  toJSON: (arg0: Schema) => Promise<any>;
  paginate: (filter: object, options: object, search?: string) => Promise<object>;
}

const userSchema: Schema<IUserDocument> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      // required: true, TODO: do we need this?
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    authType: {
      type: String,
      required: true,
      enum: authTypes,
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */

userSchema.static('searchableFields', function searchableFields(): string[] {
  return ['firstName', 'lastName', 'email'];
});

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

userSchema.static(
  'isEmailTaken',
  async function isEmailTaken(email: string, excludeUserId: mongoose.Types.ObjectId): Promise<boolean> {
    const user = this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }
);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */

userSchema.method('isPasswordMatch', async function isPasswordMatch(password: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = model<IUserDocument, IUserModel>('User', userSchema);

export default User;



