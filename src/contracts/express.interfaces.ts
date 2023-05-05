// import { Request } from 'express';
// import { ICreateUser } from './user.interfaces';



// export interface UserRequest extends Request {
//   user?: ICreateUser;

// }



import { User } from './user.interfaces';

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}