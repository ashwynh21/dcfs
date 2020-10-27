import { Injectable } from '@angular/core';
import { RefreshService, UserService } from '../../../services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { CompleteRefresh, ErrorRefresh, RefreshActionTypes } from './refresh.action';
import { Response } from '../../../helpers/response';

@Injectable()
export class RefreshEffect {
  constructor(private refreshservice: RefreshService,
              private userservice: UserService,
              private actions: Actions) {}

  refresh: Observable<Action> = createEffect(() => this.actions.pipe(
    ofType(RefreshActionTypes.RunRefresh),
    exhaustMap(() => {
      return of(this.userservice.getuser()).pipe(
        mergeMap((user) => this.refreshservice
          .refresh(user?.token).pipe(
            map(
              (response: Response) => CompleteRefresh(response)
            ),
            catchError(error => of(ErrorRefresh(error)))
          )
        ),
      );
    })
  ));
}
