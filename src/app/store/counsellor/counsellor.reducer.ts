import { CounsellorModel } from "../../models/counsellor.model";
import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CompleteCounsellor, CreateCounsellor, ErrorCounsellor, GetCounsellor } from "./counsellor.action";


export interface CounsellorState {
  loading: boolean;
  error?: Error;

  counsellor?: CounsellorModel;
}

const InitialState: CounsellorState = {
  loading: false,
}

const Reducer = createReducer<CounsellorState>(
  InitialState,
  on(CreateCounsellor, (state) => ({
    ...state,
    loading: true,
  })),
  on(GetCounsellor, (state) => ({
    ...state,
    loading: true,
  })),

  on(CompleteCounsellor, (state, action) => ({
    ...state,
    loading: false,
    counsellor: action
  })),
  on(ErrorCounsellor, (state, action) => ({
    ...state,
    loading: false,
    error: action
  }))
);

export function CounsellorReducer(state, action) {
  return Reducer(state, action);
}

const Selector = createFeatureSelector('counsellor');

export const SelectLoadingCounsellor = createSelector(
  Selector,
  (state: CounsellorState) => state.loading
)
export const SelectCounsellor = createSelector(
  Selector,
  (state: CounsellorState) => state.counsellor
)
export const SelectErrorCounsellor = createSelector(
  Selector,
  (state: CounsellorState) => state.error
)
