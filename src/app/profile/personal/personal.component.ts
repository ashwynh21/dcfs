import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UserModel } from "../../models/user.model";

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  @Input()
  user: UserModel;
  @Output()
  emitter: EventEmitter<number>;

  constructor() {
    this.emitter = new EventEmitter<number>();
  }

  ngOnInit(): void {
  }

}
