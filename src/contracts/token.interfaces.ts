import mongoose from "mongoose";

export interface IToken {
  token: string;
  user: mongoose.Schema.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted?: boolean;
}