import { Component, OnInit } from '@angular/core';
import { EnrollComponent } from "../dashboard/land/enroll/enroll.component";
import { MatDialog } from "@angular/material/dialog";
import { combineLatest, Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { GetUsers, SelectUserList, SelectUserPage } from "../store/user";
import { UserModel } from "../models/user.model";
import { SelectCounsellor } from "../store/counsellor";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-counsellors',
  templateUrl: './counsellors.component.html',
  styleUrls: ['./counsellors.component.scss']
})
export class CounsellorsComponent implements OnInit {
  counsellors: Observable<Array<UserModel>>;
  length: Observable<number>;

  constructor(private dialog: MatDialog,
              private store: Store) { }

  ngOnInit(): void {
    this.counsellors = this.store.select(SelectUserList);
    this.length = this.store.select(SelectUserPage).pipe(map(page => page.length));

    combineLatest([this.counsellors, this.store.select(SelectCounsellor)])
      .subscribe(([counsellors, counsellor]) => {

        if(counsellors.length < 1 && counsellor) {
          this.store.dispatch(GetUsers({
            counsellor: counsellor._id
          }))
        }

      });
  }
  enroll() {
    this.dialog.open(EnrollComponent, {
      width: '50%',
      height: '64%',
    });
  }

}
