export interface UserModel {
  _id: string;

  username: string;
  password: string;
  fullname: string;

  access: Array<string>;
  /*
  * we require more properties to expand on users. it is required that we
  * control the access of the users using the string array above but it is also
  * required that we collect information to qualify the user against the
  * access that they have been granted...
  * */
  bio?: {
    pin: string;
    marital?: {
      fullname: string;
      pin: string;
      dependents: number;
    },
    physical: string;
    postal: {
      address: string;
      code: string;
    };
    mobile: string;
  };
  employment?: {
    name: string;
    postal: {
      address: string;
      code: string;
    }
  };
  income?: {
    statement: string;
    gross: number;
    deductions: number;
    total: number;
  }
  expenses?: { name: string; amount: number; created: Date; updated: Date }[];
  debt?: {
    name: string;
    account: string;
    outstanding: number;
    monthly: number;
    created: Date;
    updated: Date;
  }[];

  registration?: {
    name: string;
    fsra: string;
    physical: string;
    mobile: string;
  };

  created: Date;
  updated: Date;
  /*
  * the token is not part of the user model from the database perspective but
  * we put it in here for the caching purposes of the application
  * */
  token: string;
}
