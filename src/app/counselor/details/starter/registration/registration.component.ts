import { Component, Input, OnInit } from "@angular/core";
import { UserModel } from "../../../../models/user.model";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  @Input()
  user: UserModel;

  constructor() { }

  ngOnInit(): void {
  }

}
