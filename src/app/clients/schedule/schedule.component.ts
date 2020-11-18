import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientModel } from "../../models/client.model";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements AfterViewInit {
  @ViewChild('chart') chart: ElementRef<HTMLCanvasElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      client?: ClientModel
    }) { }

  ngAfterViewInit(): void {
    this.chartinit();
  }

  duration(debt: {outstanding: number, monthly: number}) {
    return Math.floor((debt.outstanding / debt.monthly) + 1);
  }
  chartinit() {
    let debts = [ ...this.data.client.debts ];

    const projection = Array.from({
      length: Math.max(...debts.map((d) => Number(d.outstanding) / Number(d.monthly) + 2 ))
    }, (e, month) => {
      return debts.reduce((a, d, i) => {
        const balance = d.outstanding - ((d.monthly) * (month));

        if((balance + d.monthly) > d.monthly) {
          a.push({
            balance,
            payment: d.monthly
          });
        } else {

          if((balance + d.monthly) < 1) return a;

          a.push({
            balance: 0,
            payment: (balance + d.monthly)
          });
        }

        return a;
      }, []);
    });

    console.log(projection);
  }

}
