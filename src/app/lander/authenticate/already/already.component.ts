import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { UserModel } from "../../../models/user.model";
import { AuthenticateUserCookie, RemoveAuthenticate, SelectUser } from "../../../store/user";

@Component({
  selector: 'app-already',
  templateUrl: './already.component.html',
  styleUrls: ['./already.component.scss']
})
export class AlreadyComponent {

  constructor(
    public dialog: MatDialogRef<AlreadyComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {
      user: UserModel
    },
    private store: Store
  ) {

    this.store.pipe(select(SelectUser))
      .subscribe(
        (profile) => {
          if (profile) {
            data.user = profile;
          } else {
            this.store.dispatch(AuthenticateUserCookie());
          }
        }
      ).unsubscribe();
  }

  public async signout() {
    this.store.dispatch(RemoveAuthenticate());
    this.dialog.close();
  }
  public async signin() {
    this.dialog.close();
    this.router.navigate(['dashboard']);
  }
}
