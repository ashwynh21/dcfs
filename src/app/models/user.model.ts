export interface UserModel {
  _id: string;

  username: string;
  password: string;

  access: Array<string>;

  created: Date;
  updated: Date;
  /*
  * the token is not part of the user model from the database perspective but
  * we put it in here for the caching purposes of the application
  * */
  token: string;
}
