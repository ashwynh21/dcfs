import { createEntityAdapter, EntityAdapter, EntityState, Update } from "@ngrx/entity";
import { UserModel } from "../../models/user.model";
import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import {
  AuthenticateUser,
  AuthenticateUserCookie, CompleteCreateUser, CompleteGetUsers, CompleteRemoveUser,
  CompleteStateUser, CompleteUpdateUser, CompleteUser, CreateUser,
  ErrorUser, GetUsers, NoAuthenticate, RecoverUser, RefreshUser,
  RemoveAuthenticate, RemoveUser, UpdateUser
} from "./user.action";

export interface UserState extends EntityState<UserModel> {
  loading: boolean;

  error?: Error
  user?: UserModel;

  length: number;
  page: number;
  size: number;
}

const UserAdapter: EntityAdapter<UserModel> = createEntityAdapter<UserModel>({
  selectId: (client: UserModel) => client._id,
  sortComparer: (a: UserModel, b: UserModel): number => a._id.localeCompare(b._id)
});

const InitialState = UserAdapter.getInitialState({
  loading: false,
  length: 0,
  page: 0,
  size: 10,
});

const Reducer = createReducer<UserState>(
  InitialState,

  on(AuthenticateUser, (state) => ({
    ...state,
    loading: true
  })),
  on(AuthenticateUserCookie, (state) => ({
    ...state,
    loading: true
  })),
  on(NoAuthenticate, (state) => ({
    ...state,
    loading: false
  })),
  on(CreateUser, (state) => ({
    ...state,
    loading: true
  })),
  on(UpdateUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(RecoverUser, (state) => ({
    ...state,
    loading: true
  })),
  on(RefreshUser, (state) => ({
    ...state,
    loading: true
  })),
  on(GetUsers, (state) => ({
    ...state,
    loading: true,
  })),
  on(RemoveUser, (state) => ({
    ...state,
    loading: false,
  })),

  on(ErrorUser, (state, action) => ({
    ...state,
    loading: false,
    error: action
  })),

  on(CompleteUser, (state) => ({
    ...state,
    loading: false,
  })),
  on(CompleteStateUser, (state, action) => ({
    ...state,
    loading: false,
    user: action
  })),
  on(CompleteCreateUser, (state, action) => UserAdapter.addOne(action, {
    ...state,
    loading: false,
    length: state.length + 1,
  })),
  on(CompleteGetUsers, (state, action) => UserAdapter.addMany(action.users, {
    ...state,
    loading: false,
    length: action.length,
    page: state.page + 1,
  })),
  on(CompleteUpdateUser, (state, action) => UserAdapter.updateOne({
    id: action._id,
    changes: action
  }, {
    ...state,
    loading: false
  })),
  on(CompleteRemoveUser, (state, action) => UserAdapter.removeOne(action._id, {
    ...state,
    loading: false
  })),

  on(RemoveAuthenticate, (state) => ({
    ...state,
    user: undefined
  })),
);

export function UserReducer(state, action) {
  return Reducer(state, action);
}

const {
  selectAll,
} = UserAdapter.getSelectors();

const Selector = createFeatureSelector('user');

export const SelectLoadingUser = createSelector(
  Selector,
  (state: UserState) => state.loading
);
export const SelectErrorUser = createSelector(
  Selector,
  (state: UserState) => state.error
);
export const SelectUser = createSelector(
  Selector,
  (state: UserState) => state.user
);

export const SelectUserList = createSelector(
  Selector,
  selectAll,
);

export const SelectUserPage = createSelector(
  Selector,
  ({page, size, length}: {page: number, size: number, length: number}) => ({page, size, length})
)
