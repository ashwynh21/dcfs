import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { UserModel } from "../../models/user.model";
import { Store } from "@ngrx/store";
import { SelectCompleteAuthenticate } from "../../store/user/authenticate";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  user: Observable<UserModel>;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectCompleteAuthenticate);
  }

  show(user: UserModel): boolean {
    console.log(user);
    return !!user && !!user?.registration?.name;
  }
}
