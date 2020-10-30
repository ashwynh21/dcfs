import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UserModel } from "../../models/user.model";
import { Store } from "@ngrx/store";
import { SelectCompleteAuthenticate } from "../../store/user/authenticate";

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {
  toggle: boolean = true;
  user: Observable<UserModel>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectCompleteAuthenticate);
  }
}
