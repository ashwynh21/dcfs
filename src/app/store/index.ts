import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { UserReducer, UserState } from './user';

export interface State {
  user: UserState;
}

export const Reducers: ActionReducerMap<State> = {
  user: UserReducer,
};

export const MetaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
