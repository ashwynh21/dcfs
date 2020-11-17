import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { ClientModel } from "../models/client.model";
import { GetClients, SelectClientList, SelectClientPage } from "../store/clients";
import { CounsellorModel } from "../models/counsellor.model";
import { SelectCounsellor } from "../store/counsellor";
import { MatDialog } from "@angular/material/dialog";
import { CreateComponent } from "../dashboard/land/create/create.component";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Observable<Array<ClientModel>>;
  counsellor: Observable<CounsellorModel>;

  length: Observable<number>;
  indebtment: Observable<number>;

  constructor(private store: Store,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.clients = this.store.select(SelectClientList);
    this.length = this.store.select(SelectClientPage).pipe(map(page => page.length));
    this.counsellor = this.store.select(SelectCounsellor);

    combineLatest([this.clients, this.counsellor])
      .subscribe(([clients, counsellor]) => {

        if(clients.length < 1 && counsellor) {
          this.store.dispatch(GetClients({
            counsellor: counsellor._id
          }))
        }

      });
    this.indebtment = this.clients
      .pipe(
        map(clients => {
          return clients.reduce((a, c) => {

            const percentage = ((c.income.gross - c.income.deductions) /* this is the nett pay */
              - (c.expenses.reduce((a, e) => a + e.amount, 0) + c.debts.reduce((a, d) => a + d.monthly, 0))) /* this is total expense and debts */
              / (c.income.gross - c.income.deductions) /* divide by the nett again */;
            const indebtedness = 1 - percentage;

            return a + indebtedness;
          }, 0) / (clients.length < 1 ? 1: clients.length)
        })
      )
  }

  create() {
    this.dialog.open(CreateComponent, {
      width: '64%',
      height: '66%'
    });
  }
}
