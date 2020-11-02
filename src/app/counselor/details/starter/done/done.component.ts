import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { RunAuthenticateCookie } from "../../../../store/user/authenticate";

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.scss']
})
export class DoneComponent implements OnInit {
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
