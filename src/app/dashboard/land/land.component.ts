import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { CounsellorModel } from "../../models/counsellor.model";
import { Store } from "@ngrx/store";
import { SelectCounsellor } from "../../store/counsellor";
import { UserModel } from "../../models/user.model";
import { SelectUser } from "../../store/user";

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.scss']
})
export class LandComponent implements OnInit {
  /*
  * Since we are to want to show the counsellor profile we will need the
  * observable
  * */
  counsellor: Observable<CounsellorModel>;
  /*
  * We will also need to show the users information
  * */
  user: Observable<UserModel>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.counsellor = this.store.select(SelectCounsellor);
    this.user = this.store.select(SelectUser);
  }

}
