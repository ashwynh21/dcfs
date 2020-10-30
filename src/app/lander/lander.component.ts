import { AfterViewInit, Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { RunAuthenticateCookie, SelectCompleteAuthenticate } from "../store/user/authenticate";
import { AlreadyComponent } from "./authenticate/already/already.component";

@Component({
  selector: 'app-lander',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent implements AfterViewInit {
  constructor(private store: Store,
              private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.store.select(SelectCompleteAuthenticate)
      .subscribe(user => {
        if(user) {
          this.dialog.open(AlreadyComponent, {
            width: '512px',
            data: {user}
          });
        } else {
          this.store.dispatch(RunAuthenticateCookie());
        }
      }).unsubscribe()
  }

}
