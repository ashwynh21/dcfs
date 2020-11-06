import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { UserModel } from "../../../models/user.model";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnChanges {
  @Input()
  user?: UserModel;
  @Input()
  icon?: string;
  @Input()
  name?: string;

  @Input()
  expanded: boolean = true;

  toggle: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.expanded) {
      this.expanded = changes.expanded.currentValue;
    }
  }
}
