import { CounsellorReducer, CounsellorState } from "./counsellor";

export * from './user';
export * from './counsellor';

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { UserReducer, UserState } from './user';
import { ClientReducer, ClientState } from "./clients";
import { ToolsReducer, ToolsState } from "./tools";

export interface State {
  user: UserState,
  counsellor: CounsellorState,
  client: ClientState,
  tools: ToolsState,
}

export const Reducers: ActionReducerMap<State> = {
  user: UserReducer,
  counsellor: CounsellorReducer,
  client: ClientReducer,
  tools: ToolsReducer,
};

export const MetaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
