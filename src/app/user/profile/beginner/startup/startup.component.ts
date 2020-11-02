import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent implements OnInit {
  @Output()
  emitter: EventEmitter<number>

  constructor() {
    this.emitter = new EventEmitter<number>();
  }

  ngOnInit(): void {
  }

  next() {
    this.emitter.emit(1);
  }
}
