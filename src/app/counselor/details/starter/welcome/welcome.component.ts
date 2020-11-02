import { Component, Input, OnInit } from "@angular/core";
import { UserModel } from "../../../../models/user.model";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @Input()
  user: UserModel;

  constructor() { }

  ngOnInit(): void {
  }

}
