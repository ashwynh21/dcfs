import { Injectable } from "@angular/core";
import { AccessService, RefreshService, UserService, SocketService } from "../../services";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, mergeMap } from "rxjs/operators";
import { UserModel } from "../../models/user.model";
import { Observable, of } from "rxjs";
import { Action, Store } from "@ngrx/store";
import {
  CompleteCreateUser, CompleteGetUsers, CompleteRemoveUser, CompleteStateUser, CompleteUpdateUser, CompleteUser, ErrorUser,
  NoAuthenticate,
  UserActionTypes
} from "./user.action";
import { Response } from "../../helpers/response";
import { SelectUserPage } from "./user.reducer";

@Injectable()
export class UserEffect {
  /*
  * We keep the page information here and subscribe to the page observable from
  * the state
  * */
  page: {page: number, size: number, length: number};

  constructor(
    private accessservice: AccessService,
    private userservice: UserService,
    private refreshservice: RefreshService,
    private socketservice: SocketService,
    private store: Store,
    private actions: Actions
  ) {
    this.store.select(SelectUserPage)
      .subscribe((page) => this.page = page);
  }

  authenticate = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.AuthenticateUser),
    exhaustMap((action: {username: string, password: string}) => {
      return this.accessservice
        .access(action).pipe(
          map(
            (user: UserModel) => {
              /*
              * Here we then make our socket connection */
              this.socketservice.init();

              return CompleteStateUser(user)
            }
          ),
          catchError(error => of(ErrorUser(error)))
        );
    })
  ));

  remove = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.RemoveAuthenticate),
    exhaustMap(() => {
      return this.userservice.signout().pipe(
        map((value) => value ? NoAuthenticate() : ErrorUser(new Error('Oops, something went wrong!')))
      );
    })
  ));

  cookie = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.AuthenticateUserCookie),
    exhaustMap(() => of(this.userservice
        .getuser()).pipe(
      map(
        (user: UserModel) => {
          if(user) {
            /*
            * Here we then make our socket connection */
            this.socketservice.init();

            return CompleteStateUser(user);
          }
          return NoAuthenticate();
        }
      ),
      catchError(error => of(ErrorUser(error)))
      )
    )
  ));

  recover = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.RecoverUser),
    mergeMap((action: {username: string}) => {
      return this.userservice
        .recover(action.username).pipe(
          map(
            () => CompleteUser()
          ),
          catchError(error => of(ErrorUser(error)))
        );
    })
  ));

  refresh: Observable<Action> = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.RefreshUser),
    exhaustMap(() => {
      return of(this.userservice.getuser()).pipe(
        mergeMap((user) => this.refreshservice
          .refresh(user?.token).pipe(
            map(
              () => {
                /*
                * Here we then make our socket connection */
                this.socketservice.init();

                return CompleteUser()
              }
            ),
            catchError(error => of(ErrorUser(error)))
          )
        ),
      );
    })
  ));

  create = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.CreateUser),
    exhaustMap((action) => {
      return this.userservice.create(action).pipe(
        map(
          (response: Response) => CompleteCreateUser(response.payload)
        ),
        catchError(error => of(ErrorUser(error)))
      );
    })
  ));

  read = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.GetUsers),
    mergeMap((action: Partial<UserModel>) => this.userservice.read({...action, page: this.page.page, size: this.page.size})
      .pipe(
        map((response: Response) => CompleteGetUsers({ users: response.payload.page, length: response.payload.length })),
        catchError(error => of(ErrorUser(error)))
      )),
  ));

  update = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.UpdateUser),
    mergeMap((action: Partial<UserModel>) => this.userservice.update(action as UserModel)
      .pipe(
        map((response: Response) => CompleteUpdateUser(response.payload)),
        catchError(error => of(ErrorUser(error)))
      ))
  ));

  delete = createEffect(() => this.actions.pipe(
    ofType(UserActionTypes.RemoveUser),
    mergeMap((action: Partial<UserModel>) => this.userservice.delete(action as UserModel)
      .pipe(
        map((response: Response) => CompleteRemoveUser(response.payload)),
        catchError(error => of(ErrorUser(error)))
      ))
  ));
}
