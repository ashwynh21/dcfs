import { Model } from "../helpers/model";

export interface UserModel extends Model {
  username: string;
  password: string;
  fullname: string;

  counsellor: string;

  access: Array<string>;

  /*
  * the token is not part of the user model from the database perspective but
  * we put it in here for the caching purposes of the application
  * */
  token: string;
}
