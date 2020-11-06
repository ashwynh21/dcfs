import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { combineLatest, forkJoin, Observable } from "rxjs";
import { ClientModel } from "../models/client.model";
import { GetClients, SelectClientList } from "../store/clients";
import { CounsellorModel } from "../models/counsellor.model";
import { SelectCounsellor } from "../store/counsellor";
import { MatDialog } from "@angular/material/dialog";
import { CreateComponent } from "../dashboard/land/create/create.component";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Observable<Array<ClientModel>>;
  counsellor: Observable<CounsellorModel>;

  constructor(private store: Store,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.clients = this.store.select(SelectClientList);
    this.counsellor = this.store.select(SelectCounsellor);

    combineLatest([this.clients, this.counsellor])
      .subscribe(([clients, counsellor]) => {

        if(clients.length < 1 && counsellor) {
          this.store.dispatch(GetClients({
            counsellor: counsellor._id
          }))
        }

      });
  }

  create() {
    this.dialog.open(CreateComponent, {
      width: '1000px',
      height: '520px'
    });
  }
}
