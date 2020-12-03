import { createAction, props } from "@ngrx/store";
import { CounsellorModel } from "../../models/counsellor.model";

export enum CounsellorActionTypes {
  CreateCounsellor = '[Counsellor]: CreateCounsellor',
  CompleteCounsellor = '[Counsellor]: CompleteCounsellor',
  ErrorCounsellor = '[Counsellor]: ErrorCounsellor',

  UpdateCounsellor = '[Counsellor]: UpdateCounsellor',
  /*
  * */
  GetCounsellor = '[Counsellor]: GetCounsellor',
}

export const CreateCounsellor = createAction(CounsellorActionTypes.CreateCounsellor,
  props<Partial<CounsellorModel>>());
export const GetCounsellor = createAction(CounsellorActionTypes.GetCounsellor,
  props<{_id: string}>());
export const UpdateCounsellor = createAction(CounsellorActionTypes.UpdateCounsellor,
  props<Partial<CounsellorModel>>());

export const CompleteCounsellor = createAction(CounsellorActionTypes.CompleteCounsellor,
  props<CounsellorModel>());

export const ErrorCounsellor = createAction(CounsellorActionTypes.ErrorCounsellor,
  props<Error>());
