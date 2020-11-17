import { Component, OnInit } from "@angular/core";
import { ClientModel } from "../../models/client.model";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { GetClients, SelectClientList } from "../../store/clients";
import { map } from "rxjs/operators";
import { combineLatest, Observable } from "rxjs";
import { scaleLinear } from "d3";
import { MatDialog } from "@angular/material/dialog";
import { SelectCounsellor } from "../../store/counsellor";
import { ScheduleComponent } from "../schedule/schedule.component";
import { CreateComponent } from "../../dashboard/land/create/create.component";
import { PersonalComponent } from "./personal/personal.component";
import { DeleteComponent } from "../delete/delete.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { ComittmentsComponent } from "./comittments/comittments.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  client: Observable<ClientModel>;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private store: Store) {
    this.client = this.store.select(SelectClientList).pipe(
      map(clients => clients.find(c => c._id == route.snapshot.paramMap.get('id').toString()))
    );

    combineLatest([this.store.select(SelectClientList), this.store.select(SelectCounsellor)])
      .subscribe(([clients, counsellor]) => {
        if(clients.length < 1 && counsellor) {
          this.store.dispatch(GetClients({
            counsellor: counsellor._id
          }))
        }
      });
  }

  ngOnInit(): void {
  }


  compute(client: ClientModel): number {
    const percentage = ((client.income.gross - client.income.deductions) /* this is the nett pay */
      - (client.expenses.reduce((a, e) => a + e.amount, 0) + client.debts.reduce((a, d) => a + d.monthly, 0))) /* this is total expense and debts */
      / (client.income.gross - client.income.deductions) /* divide by the nett again */;

    return (1 - percentage);
  }

  interpolate(percent: number): string {
    const interpolator = scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(['#080', '#F80', '#800']);

    return interpolator(percent);
  }

  bar(percent) {
    return percent > 1 ? 1 : percent
  }
  expenses(client: ClientModel) {
    return client.expenses.reduce((a, b) => Number(a) + Number(b.amount), 0);
  }
  outstanding(client: ClientModel) {
    return client.debts.reduce((a, b) => a + b.outstanding, 0)
  }
  time(client: ClientModel) {
    return Math.floor(Math.max(...client.debts.map((c) => c.outstanding/c.monthly))) + 1;
  }
  marital(client: ClientModel) {
    return client.marital ?
      `married to ${client.marital.fullname}(${client.marital.pin}) with ${client.marital.dependents} dependents.` :
      'single.';
  }
  reschedule() {
    this.dialog.open(ScheduleComponent, {
      width: '68%',
      height: '72%',
    });
  }
  create() {
    this.dialog.open(CreateComponent, {
      width: '64%',
      height: '66%'
    });
  }
  personal() {
    this.client.subscribe(client => {
      if(client) {
        this.dialog.open(PersonalComponent, {
          width: '64%',
          height: '66%',
          data: {
            client
          }
        })
      }
    }).unsubscribe()
  }
  remove() {
    this.client.subscribe(client => {
      if(client) {
        this.dialog.open(DeleteComponent, {
          width: '32%',
          data: {
            client
          }
        })
      }
    }).unsubscribe();
  }
  manageexpeneses() {
    this.client.subscribe(client => {
      if(client) {
        this.dialog.open(ExpensesComponent, {
          width: '70%',
          height: '80%',
          data: {
            client
          }
        })
      }
    }).unsubscribe();
  }
  managedebts() {
    this.client.subscribe(client => {
      if(client) {
        this.dialog.open(ComittmentsComponent, {
          width: '70%',
          height: '80%',
          data: {
            client
          }
        })
      }
    }).unsubscribe();
  }
}
