import { Response } from '../../../helpers/response';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { CompleteRecover, ErrorRecover, RunRecover } from './recover.action';
import { UserState } from '../index';

export interface RecoverState {
  loading: boolean;

  error?: Error;
  recover?: Response;
}

const InitialState: RecoverState = {
  loading: false
};

const reducer = createReducer<RecoverState>(
  InitialState,

  on(RunRecover, (state) => ({
    ...state,
    loading: true
  })),
  on(CompleteRecover, (state, action) => ({
    ...state,
    loading: false,
    recover: action
  })),
  on(ErrorRecover, (state, action) => ({
    ...state,
    loading: false,
    error: action
  }))
);

export function RecoverReducer(state: RecoverState, action: Action) {
  return reducer(state, action);
}

const SelectUser = createFeatureSelector<UserState>('user');

export const SelectRecover = createSelector(
  SelectUser,
  (state: UserState) => state.recover
);

export const SelectErrorRecover = createSelector(
  SelectRecover,
  (state: RecoverState) => state.error
);

export const SelectLoadingRecover = createSelector(
  SelectRecover,
  (state: RecoverState) => state.loading
);

export const SelectCompleteRecover = createSelector(
  SelectRecover,
  (state: RecoverState) => state.recover
);
