import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  @Output()
  emitter: EventEmitter<number>;

  constructor() {
    this.emitter = new EventEmitter<number>();
  }

  ngOnInit(): void {
  }

}
