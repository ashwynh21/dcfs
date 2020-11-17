import { Component, Input, OnInit } from "@angular/core";
import { UserModel } from "../../models/user.model";
import { MatDialog } from "@angular/material/dialog";
import { EnrollComponent } from "../../dashboard/land/enroll/enroll.component";
import { DeleteComponent } from "../delete/delete.component";

@Component({
  selector: 'app-counsellor',
  templateUrl: './counsellor.component.html',
  styleUrls: ['./counsellor.component.scss']
})
export class CounsellorComponent implements OnInit {
  @Input()
  user: UserModel;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {

  }

  edit() {
    this.dialog.open(EnrollComponent, {
      width: '50%',
      height: '64%',
      data: {
        user: this.user
      }
    });
  }
  remove() {
    this.dialog.open(DeleteComponent, {
      width: '32%',
      data: {
        user: this.user
      }
    })
  }
}
