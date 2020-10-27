import { Action, ActionReducer, combineReducers } from '@ngrx/store';
import { AuthenticateReducer, AuthenticateState } from './authenticate';
import { RecoverReducer, RecoverState } from './recover';
import { RefreshReducer, RefreshState } from './refresh';

export interface UserState {
  authenticate: AuthenticateState;
  recover: RecoverState;
  refresh: RefreshState;
}
const reducers = {
  authenticate: AuthenticateReducer,
  recover: RecoverReducer,
  refresh: RefreshReducer,
};

const reducer: ActionReducer<UserState> = combineReducers(reducers);

export function UserReducer(state: UserState, action: Action) {
  return reducer(state, action);
}
