import { JwtPayload } from "jsonwebtoken";

export interface IApple extends JwtPayload {
  email: string;
}

export interface ICreateAppleUser {
  firstName: string;
  lastName: string;
  email: string;
  authType: string;
  role: string;
}