import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UserModel } from "../../models/user.model";
import { Store } from "@ngrx/store";
import { RemoveAuthenticate, SelectCompleteAuthenticate } from "../../store/user/authenticate";
import { Router } from "@angular/router";

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {
  toggle: boolean = true;
  user: Observable<UserModel>;

  constructor(private store: Store,
              private router: Router) { }

  ngOnInit(): void {
    this.user = this.store.select(SelectCompleteAuthenticate);
  }

  exit() {
    this.store.dispatch(RemoveAuthenticate());
    this.user.subscribe(user => {
      if(!user) {
        this.router.navigate(['authenticate']);
      }
    })
  }
}
