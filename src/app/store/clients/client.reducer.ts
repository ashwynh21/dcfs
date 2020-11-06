import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ClientModel } from "../../models/client.model";
import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CompleteClients, CompleteCreateClient, CreateClient, ErrorClients, GetClients } from "./client.action";


export interface ClientState extends EntityState<ClientModel> {
  loading: boolean;

  length: number;
  page: number;
  size: number;

  error?: Error;
}

const ClientAdapter: EntityAdapter<ClientModel> = createEntityAdapter<ClientModel>({
  selectId: (client: ClientModel) => client._id,
  sortComparer: (a: ClientModel, b: ClientModel): number => a._id.localeCompare(b._id)
});

const InitialState = ClientAdapter.getInitialState({
  loading: false,
  length: 0,
  page: 0,
  size: 10,
});

const Reducer = createReducer<ClientState>(
  InitialState,
  on(GetClients, (state) => ({
    ...state,
    loading: true
  })),
  on(CreateClient, (state) => ({
    ...state,
    loading: true,
  })),
  on(CompleteClients, (state, action) => ClientAdapter.addMany(action.clients, {
    ...state,
    loading: false,
    length: action.length,
    page: state.page + 1,
  })),
  on(CompleteCreateClient, (state, action) => ClientAdapter.addOne(action, {
    ...state,
    loading: false,
    length: state.length + 1,
  })),
  on(ErrorClients, (state, action) => ({
    ...state,
    loading: false,
    error: action
  }))
);

export function ClientReducer(state, action) {
  return Reducer(state, action);
}

const {
  selectAll,
} = ClientAdapter.getSelectors();

const Selector = createFeatureSelector('client');

export const SelectClientList = createSelector(
  Selector,
  selectAll,
);

export const SelectErrorClient = createSelector(
  Selector,
  (state: ClientState) => state.error
);

export const SelectLoadingClient = createSelector(
  Selector,
  (state: ClientState) => state.loading
);

export const SelectClientPage = createSelector(
  Selector,
  ({page, size, length}: {page: number, size: number, length: number}) => ({page, size, length})
)
