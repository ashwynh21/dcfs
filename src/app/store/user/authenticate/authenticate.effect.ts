import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AccessService, UserService } from '../../../services';
import { AuthenticateActionTypes, CompleteAuthenticate, ErrorAuthenticate, NoAuthenticate } from './authenticate.action';
import { UserModel } from '../../../models/user.model';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthenticateEffect {
  constructor(
    private accessservice: AccessService,
    private userservice: UserService,
    private actions: Actions
  ) {}

  authenticate = createEffect(() => this.actions.pipe(
    ofType(AuthenticateActionTypes.RunAuthenticate),
    exhaustMap((action: {username: string, password: string}) => {
      return this.accessservice
        .access(action).pipe(
          map(
            (user: UserModel) => CompleteAuthenticate(user)
          ),
          catchError(error => of(ErrorAuthenticate(error)))
        );
    })
  ));

  remove = createEffect(() => this.actions.pipe(
    ofType(AuthenticateActionTypes.RemoveAuthenticate),
    exhaustMap(() => {
      return this.userservice.signout().pipe(
        map((value) => value ? NoAuthenticate() : ErrorAuthenticate(new Error('Oops, something went wrong!')))
      );
    })
  ));

  cookie = createEffect(() => this.actions.pipe(
    ofType(AuthenticateActionTypes.RunAuthenticateCookie),
    exhaustMap(() => of(this.userservice
      .getuser()).pipe(
        map(
          (user: UserModel) => {
            if(user) {
              return CompleteAuthenticate(user);
            }
            return NoAuthenticate();
          }
        ),
        catchError(error => of(ErrorAuthenticate(error)))
      )
    )
  ));
}
