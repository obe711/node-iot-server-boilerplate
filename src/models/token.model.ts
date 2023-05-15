import mongoose, { Model, Schema } from 'mongoose';
import { IToken } from '../contracts/token.interfaces';
import { toJSON }  from './plugins';
import { tokenTypes } from '../config/tokens';

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

const Token: Model<IToken> = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
