import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from "rxjs";
import { UserModel } from "../../models/user.model";
import { Store } from "@ngrx/store";
import { SelectUser } from "../../store/user";
import { CounsellorModel } from "../../models/counsellor.model";
import { GetCounsellor, SelectCounsellor } from "../../store/counsellor";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  user: Observable<UserModel>;
  counsellor: Observable<CounsellorModel>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectUser);
    this.counsellor = this.store.select(SelectCounsellor);

    const subscription = combineLatest([this.user, this.counsellor])
      .subscribe(([user, counsellor]) => {
        if(!counsellor && user) {
          this.store.dispatch(GetCounsellor({_id: user.counsellor}))
        }

        if(counsellor && user) {
          subscription.unsubscribe();
        }
      });
  }
}
