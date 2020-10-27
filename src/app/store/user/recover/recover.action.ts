import { createAction, props } from '@ngrx/store';
import { Response } from '../../../helpers/response';

export enum RecoverActionTypes {
  RunRecover = '[Recover]: RunRecover',
  CompleteRecover = '[Recover]: CompleteRecover',
  ErrorRecover = '[Recover]: ErrorRecover'
}

export const RunRecover = createAction(RecoverActionTypes.RunRecover,
  props<{username: string}>());

export const CompleteRecover = createAction(RecoverActionTypes.CompleteRecover,
  props<Response>());

export const ErrorRecover = createAction(RecoverActionTypes.ErrorRecover,
  props<Error>());
