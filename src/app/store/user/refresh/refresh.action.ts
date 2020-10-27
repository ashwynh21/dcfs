import { createAction, props } from '@ngrx/store';
import { Response } from '../../../helpers/response';

export enum RefreshActionTypes {
  RunRefresh = '[Refresh]: RunRefresh',
  ErrorRefresh = '[Refresh]: ErrorRefresh',
  CompleteRefresh = '[Refresh]: SuccessRefresh'
}

export const RunRefresh = createAction(RefreshActionTypes.RunRefresh);

export const ErrorRefresh = createAction(RefreshActionTypes.ErrorRefresh,
  props<Error>());

export const CompleteRefresh = createAction(RefreshActionTypes.CompleteRefresh,
  props<Response>());
