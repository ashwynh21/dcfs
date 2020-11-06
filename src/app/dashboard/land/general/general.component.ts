import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ClientState, GetClients, SelectClientList, SelectClientPage } from "../../../store/clients";
import { Observable } from "rxjs";
import { CounsellorModel } from "../../../models/counsellor.model";
import { GetUsers, SelectUserPage, UserState } from "../../../store/user";
import { map, toArray } from "rxjs/operators";

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  @Input()
  counsellor: CounsellorModel;

  @ViewChild('content') content: ElementRef<HTMLDivElement>;

  clientpage: Observable<Partial<ClientState>>;
  userpage: Observable<Partial<UserState>>;
  debt: Observable<number>;
  indebtment: Observable<number>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(GetClients({
      counsellor: this.counsellor._id,
    }));
    this.store.dispatch(GetUsers({
      counsellor: this.counsellor._id
    }));

    this.clientpage = this.store.select(SelectClientPage);
    this.userpage = this.store.select(SelectUserPage);
    this.debt = this.store.select(SelectClientList)
      .pipe(
        map(clients => clients.reduce((a, c) => c.debts.reduce((b, d) => b + d.outstanding, 0) + a, 0) / (clients.length < 1 ? 1: clients.length))
      );
    this.indebtment = this.store.select(SelectClientList)
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

  right() {
    this.content.nativeElement.scrollBy({
      behavior: "smooth",
      left: 160
    })
  }
  left() {
    this.content.nativeElement.scrollBy({
      behavior: "smooth",
      left: -160
    } as ScrollToOptions)
  }
}
