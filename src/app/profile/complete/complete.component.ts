import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { RunAuthenticateCookie } from "../../store/user/authenticate";

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  @Output()
  emitter: EventEmitter<boolean>;

  constructor(private store: Store) {
    this.emitter = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
  }

  click() {
    this.store.dispatch(RunAuthenticateCookie());
  }
}
