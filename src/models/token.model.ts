import mongoose, { Model, Schema } from 'mongoose';
import { IToken } from '../contracts/token.interfaces';

const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

// interface IToken {
//   token: string;
//   user: mongoose.Schema.Types.ObjectId;
//   type: string;
//   expires: Date;
//   blacklisted?: boolean;
// }

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
