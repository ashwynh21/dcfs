import { Component, Input, OnInit } from "@angular/core";
import { ClientModel } from "../../models/client.model";

import { scaleLinear } from 'd3';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  @Input()
  client: ClientModel

  constructor() { }

  ngOnInit(): void {
  }

  compute(): number {
    const percentage = ((this.client.income.gross - this.client.income.deductions) /* this is the nett pay */
      - (this.client.expenses.reduce((a, e) => a + e.amount, 0) + this.client.debts.reduce((a, d) => a + d.monthly, 0))) /* this is total expense and debts */
      / (this.client.income.gross - this.client.income.deductions) /* divide by the nett again */;

    return 1 - percentage;
  }

  interpolate(percent: number): string {
    const interpolator = scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(['#080', '#F80', '#800']);

    return interpolator(percent);
  }
  bar(percent) {
    return percent > 1 ? 1 : percent
  }
}
