import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CompleteTools, ErrorTools, SendSchedule } from "./tools.action";
import { CounsellorState } from "../counsellor";


export interface ToolsState {
  loading: boolean;
  error?: Error;
}

const InitialState: ToolsState= {
  loading: false
};

const Reducer = createReducer<ToolsState>(
  InitialState,
  on(SendSchedule, (state) => ({
    ...state,
    loading: true
  })),
  on(ErrorTools, (state, error) => ({
    ...state,
    loading: false,
    error
  })),
  on(CompleteTools, (state) => ({
    ...state,
    loading: false
  }))
);

export function ToolsReducer(state, action) {
  return Reducer(state, action);
}

const Selector = createFeatureSelector('tools');

export const SelectLoadingTools = createSelector(
  Selector,
  (state: ToolsState) => state.loading
)
export const SelectErrorTools = createSelector(
  Selector,
  (state: ToolsState) => state.error
)
