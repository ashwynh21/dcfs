import { Injectable } from '@angular/core';
import { UserService } from '../../../services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CompleteRecover, ErrorRecover, RecoverActionTypes } from './recover.action';
import { Response } from '../../../helpers/response';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class RecoverEffect {
  constructor(
    private userservice: UserService,
    private actions: Actions
  ) {}

  recover = createEffect(() => this.actions.pipe(
    ofType(RecoverActionTypes.RunRecover),
    mergeMap((action: {username: string}) => {
      return this.userservice
        .recover(action.username).pipe(
          map(
            (response: Response) => CompleteRecover(response)
          ),
          catchError(error => of(ErrorRecover(error)))
        );
    })
  ));
}
