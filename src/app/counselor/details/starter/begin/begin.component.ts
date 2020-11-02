import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: 'app-begin',
  templateUrl: './begin.component.html',
  styleUrls: ['./begin.component.scss']
})
export class BeginComponent implements OnInit {
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
