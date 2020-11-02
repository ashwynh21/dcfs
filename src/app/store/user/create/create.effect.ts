import { Injectable } from "@angular/core";
import { UserService } from "../../../services";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map } from "rxjs/operators";
import { of } from "rxjs";
import { CompleteCreate, CompleteUpdate, CreateActionTypes, ErrorCreate, ErrorUpdate } from "./create.action";
import { Response } from "../../../helpers/response";

@Injectable()
export class CreateEffect {
  constructor(
    private userservice: UserService,
    private actions: Actions
  ) {}

  create = createEffect(() => this.actions.pipe(
    ofType(CreateActionTypes.RunCreate),
    exhaustMap((action) => {
      return this.userservice
        .create(action).pipe(
          map(
            (user: Response) => CompleteCreate(user.payload)
          ),
          catchError(error => of(ErrorCreate(error)))
        );
    })
  ));
  update = createEffect(() => this.actions.pipe(
    ofType(CreateActionTypes.RunUpdate),
    exhaustMap((action) => {
      return this.userservice
        .update(action).pipe(
          map(
            (user: Response) => CompleteUpdate(user.payload)
          ),
          catchError(error => of(ErrorUpdate(error)))
        );
    })
  ));
}
