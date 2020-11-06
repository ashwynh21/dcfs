import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { UserModel } from "../models/user.model";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { AuthenticateUserCookie, SelectUser } from "../store/user";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /*
  * When the user lands onto the dashboard we need to run a quick computation
  * to see if the user is new. We thus say that the user is new if the difference
  * between the timestamp and the user creation date is less than 30 seconds.
  * So let us then create the function to run the computation...
  * */
  user: Observable<UserModel>;

  constructor(private store: Store,
              private router: Router) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectUser);
    this.user.subscribe(user => {
      if(!user) {
        this.store.dispatch(AuthenticateUserCookie());
      }
    });
  }
}
