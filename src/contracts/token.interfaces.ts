import mongoose, { Document, Model} from "mongoose";
import { JwtPayload } from 'jsonwebtoken';

export interface IToken {
  token: string;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

export interface ITokenDocument extends IToken, Document {}

export interface ITokenModel extends Model<ITokenDocument> {}
export interface TokenData {
  expires: Date;
  token: string;
}
export interface IPayload extends JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}
export interface ITokenPayload {
  token: string;
  expires: Date;
}

export interface IAccessAndRefreshTokens {
  access: ITokenPayload;
  refresh: ITokenPayload;
}
