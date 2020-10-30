import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { UserModel } from "../../models/user.model";
import { Store } from "@ngrx/store";
import { SelectCompleteAuthenticate } from "../../store/user/authenticate";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  user: Observable<UserModel>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectCompleteAuthenticate);
  }

}
