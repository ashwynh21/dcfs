import { createAction, props } from "@ngrx/store";
import { UserModel } from "../../../models/user.model";

export enum CreateActionTypes {
  RunCreate = '[Create]: RunCreate',
  CompleteCreate = '[Create]: CompleteCreate',
  ErrorCreate = '[Create]: ErrorCreate',

  /*
  * we will now use this state to update the user as well, so we will need some
  * action to go with that...
  * */
  RunUpdate = '[Create]: RunUpdate',
  CompleteUpdate = '[Create]: CompleteUpdate',
  ErrorUpdate = '[Create]: ErrorUpdate',
}

export const RunCreate = createAction(CreateActionTypes.RunCreate,
  props<UserModel>());

export const CompleteCreate = createAction(CreateActionTypes.CompleteCreate,
  props<UserModel>());

export const ErrorCreate = createAction(CreateActionTypes.ErrorCreate,
  props<Error>());

export const RunUpdate = createAction(CreateActionTypes.RunUpdate,
  props<UserModel>());

export const CompleteUpdate = createAction(CreateActionTypes.CompleteUpdate,
  props<UserModel>());

export const ErrorUpdate = createAction(CreateActionTypes.ErrorUpdate,
  props<Error>());
