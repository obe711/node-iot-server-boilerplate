interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};


interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  authType?: string;
  role?: string;
  isEmailVerified?: boolean;
}

module.exports = {
  ICreateUser,
  IUpdateUser
};