import { AfterViewInit, Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { AlreadyComponent } from "./authenticate/already/already.component";
import { AuthenticateUserCookie, SelectUser } from "../store/user";

@Component({
  selector: 'app-lander',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent implements AfterViewInit {
  constructor(private store: Store,
              private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.store.select(SelectUser)
      .subscribe(user => {
        if(user) {
          this.dialog.open(AlreadyComponent, {
            width: '40%',
            data: {user}
          });
        } else {
          this.store.dispatch(AuthenticateUserCookie());
        }
      }).unsubscribe()
  }

}
