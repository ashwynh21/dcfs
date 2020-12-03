import { Injectable } from "@angular/core";
import { CounsellorService } from "../../services";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { CompleteTools, ErrorTools, ToolsActionTypes } from "./tools.action";

@Injectable()
export class ToolsEffect {
  constructor(private counsellorservice: CounsellorService,
              private actions: Actions) {
  }

  sendemails = createEffect(() => this.actions.pipe(
    ofType(ToolsActionTypes.SendShedule),
    mergeMap((action) => this.counsellorservice.sendemails(action)
      .pipe(
        map(() => CompleteTools()),
        catchError(error => of(ErrorTools(error)))
      )),
  ));
}
