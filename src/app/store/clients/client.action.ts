import { createAction, props } from "@ngrx/store";
import { ClientModel } from "../../models/client.model";

export enum ClientActionTypes {
  GetClients = '[Client]: GetClients',
  CreateClient = '[Client]: CreateClient',

  CompleteClients = '[Client]: CompleteClients',
  CompleteCreateClient = '[Client]: CompleteCreateClient',
  ErrorClients = '[Client]: ErrorClients'
}

export const GetClients = createAction(ClientActionTypes.GetClients,
  props<Partial<ClientModel>>());

export const CompleteClients = createAction(ClientActionTypes.CompleteClients,
  props<{clients: Array<ClientModel>, length: number}>());
export const ErrorClients = createAction(ClientActionTypes.ErrorClients,
  props<Error>());

export const CreateClient = createAction(ClientActionTypes.CreateClient,
  props<Partial<ClientModel>>());
export const CompleteCreateClient = createAction(ClientActionTypes.CompleteCreateClient,
  props<ClientModel>());
