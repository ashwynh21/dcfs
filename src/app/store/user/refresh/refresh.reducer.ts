import { Action, createReducer, on } from '@ngrx/store';
import { CompleteRefresh, ErrorRefresh, RunRefresh } from './refresh.action';
import { Response } from '../../../helpers/response';

export interface RefreshState {
  loading: boolean;

  refresh?: Response;
  error?: Error;
}

const InitialState: RefreshState = {
  loading: false
}

const reducer = createReducer<RefreshState>(
  InitialState,
  on(RunRefresh, (state) => ({
    ...state,
    loading: true
  })),
  on(CompleteRefresh, (state, action) => ({
    ...state,
    loading: false,
    refresh: action
  })),
  on(ErrorRefresh, (state, action) => ({
    ...state,
    loading: false,
    error: action
  }))
);

export function RefreshReducer(state: RefreshState, action: Action) {
  return reducer(state, action);
}
