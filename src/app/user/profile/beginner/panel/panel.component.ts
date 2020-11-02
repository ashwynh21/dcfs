import { Component, Input, OnInit } from "@angular/core";
import { UserModel } from "../../../../models/user.model";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input()
  user: UserModel;

  constructor() { }

  ngOnInit(): void {
  }

}
