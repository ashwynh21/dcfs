import { createAction, props } from "@ngrx/store";
import { UserModel } from "../../../models/user.model";

export enum CreateActionTypes {
  RunCreate = '[Create]: RunCreate',
  CompleteCreate = '[Create]: CompleteCreate',
  ErrorCreate = '[Create]: ErrorCreate'
}

export const RunCreate = createAction(CreateActionTypes.RunCreate,
  props<UserModel>());

export const CompleteCreate = createAction(CreateActionTypes.CompleteCreate,
  props<UserModel>());

export const ErrorCreate = createAction(CreateActionTypes.ErrorCreate,
  props<Error>());
