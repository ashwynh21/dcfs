import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { SelectUser } from "../../../store/user";
import { MatDialog } from "@angular/material/dialog";
import { CreateComponent } from "../create/create.component";
import { EnrollComponent } from "../enroll/enroll.component";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  dismiss: boolean = true;

  constructor(private store: Store,
              private dialog: MatDialog) {
    this.store.select(SelectUser)
      .subscribe(user => {
        if(user) {
          const duration = ((new Date).getTime() - (new Date(user.created)).getTime()) / 1000 / 60;

          this.dismiss = duration < 2100;
        }
      })
  }

  ngOnInit(): void {
  }

  close() {
    this.dismiss = false;
  }
  create() {
    this.dialog.open(CreateComponent, {
      width: '1000px',
      height: '520px'
    });
  }
  enroll() {
    this.dialog.open(EnrollComponent, {
      width: '900px',
      height: '520px'
    });
  }
}
