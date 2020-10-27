import { createAction, props } from '@ngrx/store';
import { UserModel } from '../../../models/user.model';

export enum AuthenticateActionTypes {
  RunAuthenticate = '[Authenticate]: RunAuthenticate',
  CompleteAuthenticate = '[Authenticate]: CompletedAuthenticate',
  ErrorAuthenticate = '[Authenticate]: ErrorAuthenticate',
  RemoveAuthenticate = '[Authenticate]: RemoveAuthenticate',
  NoAuthenticate = '[Authenticate]: NoAuthenticate',
  /*
  * We need to add a way to collect user information from the cookie service
  * so we should call this action RunAuthenticateCookie and it should function
  * through the same channels as the RunAuthenticate function...
  * */
  RunAuthenticateCookie = '[Authenticate]: RunAuthenticateCookie'
}

export const RunAuthenticate = createAction(AuthenticateActionTypes.RunAuthenticate,
  props<{username: string, password: string}>());

export const CompleteAuthenticate = createAction(AuthenticateActionTypes.CompleteAuthenticate,
  props<UserModel>());

export const ErrorAuthenticate = createAction(AuthenticateActionTypes.ErrorAuthenticate,
  props<Error>());

export const RemoveAuthenticate = createAction(AuthenticateActionTypes.RemoveAuthenticate);

export const NoAuthenticate = createAction(AuthenticateActionTypes.NoAuthenticate);

export const RunAuthenticateCookie = createAction(AuthenticateActionTypes.RunAuthenticateCookie);
