import { Component, Input, OnInit } from "@angular/core";
import { UserModel } from "../../../models/user.model";
import { CounsellorModel } from "../../../models/counsellor.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input()
  user: UserModel;
  @Input()
  counsellor: CounsellorModel;

  constructor() { }

  ngOnInit(): void {
  }

}
