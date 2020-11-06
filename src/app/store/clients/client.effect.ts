import { Injectable } from "@angular/core";
import { ClientService } from "../../services/client.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ClientActionTypes, CompleteClients, CompleteCreateClient, ErrorClients } from "./client.action";
import { catchError, exhaustMap, map, mergeMap } from "rxjs/operators";
import { Response } from "../../helpers/response";
import { Store } from "@ngrx/store";
import { SelectClientPage } from "./client.reducer";
import { ClientModel } from "../../models/client.model";
import { of } from "rxjs";

@Injectable()
export class ClientEffect {
  /*
  * We keep the page information here and subscribe to the page observable from
  * the state
  * */
  page: {page: number, size: number, length: number};

  constructor(private clientservice: ClientService,
              private store: Store,
              private actions: Actions) {

    this.store.select(SelectClientPage)
      .subscribe((page) => this.page = page);
  }

  read = createEffect(() => this.actions.pipe(
    ofType(ClientActionTypes.GetClients),
    mergeMap((action: Partial<ClientModel>) => this.clientservice.read({...action, page: this.page.page, size: this.page.size})
      .pipe(
        map((response: Response) => CompleteClients({ clients: response.payload.page, length: response.payload.length}))
      ))
  ));
  create = createEffect(() => this.actions.pipe(
    ofType(ClientActionTypes.CreateClient),
    exhaustMap((action) => {
      return this.clientservice.create(action).pipe(
        map(
          (response: Response) => CompleteCreateClient(response.payload)
        ),
        catchError(error => of(ErrorClients(error)))
      );
    })
  ));
}
