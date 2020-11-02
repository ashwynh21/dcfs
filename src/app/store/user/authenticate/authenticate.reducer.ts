import { UserModel } from '../../../models/user.model';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import {
  CompleteAuthenticate,
  ErrorAuthenticate,
  NoAuthenticate,
  RemoveAuthenticate,
  RunAuthenticate,
  RunAuthenticateCookie
} from './authenticate.action';
import { UserState } from '../index';

export interface AuthenticateState {
  loading: boolean;

  error?: Error;
  user?: UserModel;
}

const InitialState: AuthenticateState = {
  loading: false
}

const reducer = createReducer<AuthenticateState>(
  InitialState,

  on(RunAuthenticate, (state) => ({
    ...state,
    loading: true
  })),
  on(ErrorAuthenticate, (state, action) => ({
    ...state,
    loading: false,
    error: action
  })),
  on(CompleteAuthenticate, (state, action) => ({
    ...state,
    loading: false,
    user: action
  })),
  on(RemoveAuthenticate, (state) => ({
    ...state,
    user: undefined
  })),
  on(NoAuthenticate, (state) => ({
    ...state,
    loading: false
  })),

  on(RunAuthenticateCookie, (state) => ({
    ...state,
    loading: true
  }))
);

export function AuthenticateReducer(state: AuthenticateState, action: Action) {
  return reducer(state, action);
}

const SelectUser = createFeatureSelector<UserState>('user');

export const SelectAuthenticate = createSelector(
  SelectUser,
  (state: UserState) => state.authenticate
);

export const SelectErrorAuthenticate = createSelector(
  SelectAuthenticate,
  (state: AuthenticateState) => state.error
);

export const SelectLoadingAuthenticate = createSelector(
  SelectAuthenticate,
  (state: AuthenticateState) => state.loading
);

export const SelectCompleteAuthenticate = createSelector(
  SelectAuthenticate,
  (state: AuthenticateState) => state.user
);
