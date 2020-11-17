import { createAction, props } from "@ngrx/store";
import { ClientModel } from "../../models/client.model";

export enum ClientActionTypes {
  GetClients = '[Client]: GetClients',
  CreateClient = '[Client]: CreateClient',
  UpdateClient = '[Client]: UpdateClient',
  RemoveClient = '[Client]: RemoveClient',

  CompleteClients = '[Client]: CompleteClients',
  CompleteCreateClient = '[Client]: CompleteCreateClient',
  CompleteUpdateClient = '[Client]: CompleteUpdateClient',
  CompleteRemoveClient = '[Client]: CompleteRemoveClient',
  ErrorClients = '[Client]: ErrorClients'
}

export const GetClients = createAction(ClientActionTypes.GetClients,
  props<Partial<ClientModel>>());
export const UpdateClient = createAction(ClientActionTypes.UpdateClient,
  props<ClientModel>());
export const RemoveClient = createAction(ClientActionTypes.RemoveClient,
  props<ClientModel>());


export const CompleteClients = createAction(ClientActionTypes.CompleteClients,
  props<{clients: Array<ClientModel>, length: number}>());
export const ErrorClients = createAction(ClientActionTypes.ErrorClients,
  props<Error>());

export const CreateClient = createAction(ClientActionTypes.CreateClient,
  props<Partial<ClientModel>>());
export const CompleteCreateClient = createAction(ClientActionTypes.CompleteCreateClient,
  props<ClientModel>());
export const CompleteUpdateClient = createAction(ClientActionTypes.CompleteUpdateClient,
  props<ClientModel>());
export const CompleteRemoveClient = createAction(ClientActionTypes.CompleteRemoveClient,
  props<ClientModel>());
