import { UserModel } from "../../../models/user.model";
import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CompleteCreate, ErrorCreate, RunCreate } from "./create.action";
import { UserState } from "../index";

export interface CreateState {
  loading: boolean;
  error?: Error;
  user?: UserModel
}

const InitialState: CreateState = {
  loading: false
};

const reducer = createReducer<CreateState>(
  InitialState,
  on(RunCreate, (state) => ({
    ...state,
    loading: true
  })),
  on(CompleteCreate, (state, action) => ({
    ...state,
    loading: false,
    user: action
  })),
  on(ErrorCreate, (state, action) => ({
    ...state,
    loading: false,
    error: action
  }))
);

export function CreateReducer(state: CreateState, action: Action) {
  return reducer(state, action);
}

const SelectUser = createFeatureSelector<UserState>('user');

export const SelectCreate = createSelector(
  SelectUser,
  (state: UserState) => state.create
);

export const SelectErrorCreate = createSelector(
  SelectCreate,
  (state: CreateState) => state.error
);

export const SelectLoadingCreate = createSelector(
  SelectCreate,
  (state: CreateState) => state.loading
);

export const SelectCompleteCreate = createSelector(
  SelectCreate,
  (state: CreateState) => state.user
);
