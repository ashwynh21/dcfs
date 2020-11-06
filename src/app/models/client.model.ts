import { Model } from "../helpers/model";

export interface ClientModel extends Model {
  counsellor: string;

  pin: string;
  fullname: string;
  email: string;
  mobile: string;

  physical: string;
  postal: {
    address: string;
    code: string;
  };

  marital?: {
    fullname: string;
    pin: string;
    dependents: number;
  };

  employment?: {
    name: string;
    postal: {
      address: string;
      code: string;
    };
  };
  income?: {
    statement: string;
    gross: number;
    deductions: number;
  };
  expenses?: { name: string; amount: number; created: Date; updated: Date }[];
  debts?: {
    name: string;
    account: string;
    outstanding: number;
    monthly: number;
    created: Date;
    updated: Date;
  }[];
}
