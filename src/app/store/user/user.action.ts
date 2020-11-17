import { createAction, props } from "@ngrx/store";
import { UserModel } from "../../models/user.model";

export enum UserActionTypes {
  /*
  * */
  AuthenticateUser = '[User]: AuthenticateUser',
  AuthenticateUserCookie = '[User]: AuthenticateUserCookie',
  RemoveAuthenticate = '[User]: RemoveAuthenticate',
  NoAuthenticate = '[User]: NoAuthenticate',
  CreateUser = '[User]: CreateUser',
  UpdateUser = '[User]: UpdateUser',
  RemoveUser = '[User]: RemoveUser',
  RecoverUser = '[User]: RecoverUser',
  GetUsers = '[User]: GetUsers',
  /*
  * */
  RefreshUser = '[User]: RefreshUser',
  ErrorUser = '[User]: ErrorUser',
  /*
  * */
  CompleteUser = '[User]: CompleteUser',
  CompleteCreateUser = '[User]: CompleteCreateUser',
  CompleteStateUser = '[User]: CompleteStateUser',
  CompleteGetUsers = '[User]: CompleteGetUsers',
  CompleteUpdateUser = '[User]: CompleteUpdateUser',
  CompleteRemoveUser = '[User]: CompleteRemoveUser'
}

export const AuthenticateUser = createAction(UserActionTypes.AuthenticateUser,
  props<{username: string, password: string}>());
export const AuthenticateUserCookie = createAction(UserActionTypes.AuthenticateUserCookie);
export const RemoveAuthenticate = createAction(UserActionTypes.RemoveAuthenticate);
export const NoAuthenticate = createAction(UserActionTypes.NoAuthenticate);
export const GetUsers = createAction(UserActionTypes.GetUsers,
  props<Partial<UserModel>>());

export const CreateUser = createAction(UserActionTypes.CreateUser,
  props<Partial<UserModel>>());
export const UpdateUser = createAction(UserActionTypes.UpdateUser,
  props<Partial<UserModel>>());
export const RemoveUser = createAction(UserActionTypes.RemoveUser,
  props<Partial<UserModel>>());

export const RecoverUser = createAction(UserActionTypes.RecoverUser,
  props<{username: string}>());
export const RefreshUser = createAction(UserActionTypes.RefreshUser);

export const ErrorUser = createAction(UserActionTypes.ErrorUser,
  props<Error>());

export const CompleteUser = createAction(UserActionTypes.CompleteUser);
export const CompleteCreateUser = createAction(UserActionTypes.CompleteCreateUser,
  props<UserModel>());
export const CompleteStateUser = createAction(UserActionTypes.CompleteStateUser,
  props<UserModel>());
export const CompleteGetUsers = createAction(UserActionTypes.CompleteGetUsers,
  props<{users: Array<UserModel>, length: number}>());
export const CompleteUpdateUser = createAction(UserActionTypes.CompleteUpdateUser,
  props<Partial<UserModel>>());
export const CompleteRemoveUser = createAction(UserActionTypes.CompleteRemoveUser,
  props<Partial<UserModel>>());
