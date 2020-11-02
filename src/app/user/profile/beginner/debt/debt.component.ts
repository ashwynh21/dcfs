import { Component, Input, OnInit } from "@angular/core";
import { UserModel } from "../../../../models/user.model";

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.scss']
})
export class DebtComponent implements OnInit {
  @Input()
  user: UserModel;

  constructor() { }

  ngOnInit(): void {
  }

}
