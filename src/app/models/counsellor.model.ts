import { Model } from "../helpers/model";

export interface CounsellorModel extends Model {
  name: string;
  fsra: string;

  physical: string;
  mobile: string;

  interest: number;
}
