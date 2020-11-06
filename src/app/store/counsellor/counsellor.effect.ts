import { Injectable } from "@angular/core";
import { CounsellorService } from "../../services/counsellor.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { CompleteCounsellor, CounsellorActionTypes, ErrorCounsellor } from "./counsellor.action";
import { RefreshService } from "../../services";
import { Response } from "../../helpers/response";

@Injectable()
export class CounsellorEffect {
  constructor(private counsellorservice: CounsellorService,
              private refreshservice: RefreshService,
              private actions: Actions) {}

  create = createEffect(() => this.actions.pipe(
    ofType(CounsellorActionTypes.CreateCounsellor),
    mergeMap((action) => {
      return this.counsellorservice.create(action).pipe(
        map(
          (response: Response) => CompleteCounsellor(response.payload)
        ),
        catchError(error => of(ErrorCounsellor(error)))
      )
    })
  ));

  read = createEffect(() => this.actions.pipe(
    ofType(CounsellorActionTypes.GetCounsellor),
    mergeMap((action) => this.counsellorservice.read(action)
      .pipe(
        map((response: Response) => CompleteCounsellor(response.payload[0])),
        catchError(error => of(ErrorCounsellor(error)))
      )),
  ));
}
