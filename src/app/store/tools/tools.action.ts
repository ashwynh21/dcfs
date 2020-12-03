import { createAction, props } from "@ngrx/store";
import { ClientModel } from "../../models/client.model";
import { CounsellorModel } from "../../models/counsellor.model";

export enum ToolsActionTypes {
  SendShedule = '[ToolsAction]: SendSchedule',

  ErrorTools = '[ToolsAction]: ErrorTools',
  CompleteTools = '[ToolsAction]: CompleteTools'
}

export const SendSchedule = createAction(ToolsActionTypes.SendShedule,
  props<{
    emails: Array<{email: string, name: string}>,
    file: String,
    client: ClientModel,
    counsellor: CounsellorModel
  }>());

export const ErrorTools = createAction(ToolsActionTypes.ErrorTools,
  props<Error>());

export const CompleteTools = createAction(ToolsActionTypes.CompleteTools);
