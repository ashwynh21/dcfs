import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientModel } from "../../models/client.model";

import moment from "moment";

import Chart, { ChartData, ChartOptions } from "chart.js";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatButtonToggleGroup } from "@angular/material/button-toggle";
import { Observable } from "rxjs";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements AfterViewInit {
  @ViewChild('chart') chartref: ElementRef<HTMLCanvasElement>;
  @ViewChild('schedule') scheduleref: ElementRef<HTMLCanvasElement>;
  @ViewChild('algorithm') algorithm: MatButtonToggleGroup;

  chart: Chart;
  schedule: Chart;
  monthly: FormGroup;

  loading: Observable<boolean>;
  error: Observable<Error>;

  constructor(
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {
      client?: ClientModel
    }) {

    const available = (this.data.client.income.gross - this.data.client.income.deductions)
      - this.data.client.expenses.reduce((a, e) => Number(e.amount) + Number(a), 0);

    this.monthly = builder.group({
      monthly: builder.array(
        data.client.debts.map(d => {
          return builder.group({
            ...Object.entries(d).reduce((a, [k, v]) => {
              a[k] = [v];
              return a;
            }, {}),
            amount: [(d.monthly / this.data.client.debts.reduce((a, d) => Number(a) + Number(d.monthly), 0) * available).toFixed(2)]
          });
        })),
      allocate: [true],
      time: []
      });
  }

  ngAfterViewInit(): void {
    /*
    * We must subscribe the the date fields*/
    this.chartinit();
    this.scheduleinit();
  }
  updatemonthly() {
    let date = this.monthly.get('time').value;
    const debts = [...this.data.client.debts];

    if(this.algorithm.value == 'time' && date) {

      /* with the number of months we can compute the monthly installment needed to reach the target */
      let monthly = debts.map(d => (d.outstanding / (moment(date).diff(moment(d.created), 'months', true))).toFixed(2));
      /* then we update the form with the new monthly values...
       * i = o / (s - c)
      * */
      (this.monthly['controls']['monthly']['controls'].forEach((c, i) => {
        if(monthly[i]) {
          c['controls']['amount'].setValue(monthly[i]);
        }
      }))
    } else if(this.algorithm.value == 'time' && !date) {

      const available = (this.data.client.income.gross - this.data.client.income.deductions)
        - this.data.client.expenses.reduce((a, e) => Number(e.amount) + Number(a), 0);

      const created = new Date(debts[0].created??(Date()));

      date = moment(created).add(Math.ceil(debts.reduce((a, d) => Number(a) + Number(d.outstanding), 0) / available), 'months').toDate();
      this.monthly.get('time').setValue(date);

    } else if(this.algorithm.value == 'max'){
      const available = (this.data.client.income.gross - this.data.client.income.deductions)
        - this.data.client.expenses.reduce((a, e) => Number(e.amount) + Number(a), 0);

      (this.monthly['controls']['monthly']['controls'].forEach((c, i) => {
        if(debts[i]) {
          const d = debts[i];
          c['controls']['amount'].setValue((d.monthly / this.data.client.debts.reduce((a, d) => Number(a) + Number(d.monthly), 0) * available).toFixed(2));
        }
      }))
    }
  }

  chartinit() {
    let debts = [ ...this.data.client.debts ];
    /*
    * To make the generation work better we need to get the difference between the
    * min date and the max date...
    * */
    const min = new Date(Math.min(...debts.map(d => (new Date(d.created)).getTime())));

    const projection = Array.from({
      length: Math.max(...debts.map((d) => Number(d.outstanding) / Number(d.monthly) + 2 ))
    }, (e, month) => {
      return debts.reduce((a, d, i) => {
        const balance = d.outstanding - ((d.monthly) * (month));

        if((balance + d.monthly) > d.monthly) {
          a.push({
            balance,
            payment: d.monthly,
            name: d.name
          });
        } else {

          if((balance + d.monthly) < 1) return a;

          a.push({
            balance: 0,
            payment: (balance + d.monthly),
            name: d.name
          });
        }

        return a;
      }, []);
    });

    const data = this.remap(projection);

    /*
    * Now with the projection array done, we just need to generate the graph
    * and display on the user interface...
    * */
    this.chart = new Chart(this.chartref.nativeElement.getContext('2d'), {
      type: 'line',
      data: <ChartData>{
        labels: projection.map((p, i) => moment(Date()).add(i, 'months').format('MMM, YY')),
        datasets: data,
      },
      options: <ChartOptions>{
        tooltips: {
          callbacks: {
            title:(tooltip, data): string | string[] => {
              return new DatePipe('en-US').transform(new Date(tooltip[0].label));
            },
            label: (tooltip) => {
              return `balance: ${(new CurrencyPipe('en-US')).transform(tooltip.value, 'E')}`;
            }
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            distribution: 'series',
            time: {
              unit: 'month',
              displayFormats: {month: 'MMM', year: 'YYYY'},
              min: min.toString(),
            }
          }],
          yAxes: [{
            ticks: {
              callback(value: number) {
                return (new CurrencyPipe('en-US')).transform(value, 'E');
              }
            }
          }]
        }
      }
    });
  }
  scheduleinit() {
    const min = new Date(Math.min(...this.data.client.debts.map(d => (new Date(d.created)).getTime())));
    const data = this.algorithm.value === 'time' ? this.timer() : this.maximize();

    if(!this.schedule) {
      this.schedule = new Chart(this.scheduleref.nativeElement.getContext('2d'), {
        type: 'line',
        data: <ChartData>{
          datasets: data,
        },
        options: <ChartOptions>{
          tooltips: {
            callbacks: {
              title:(tooltip): string | string[] => {
                return new DatePipe('en-US').transform(new Date(tooltip[0].label));
              },
              label: (tooltip) => {
                return `balance: ${(new CurrencyPipe('en-US')).transform(tooltip.value, 'E')}`;
              }
            }
          },
          scales: {
            xAxes: [{
              type: 'time',
              display: true,
              distribution: 'series',
              time: {
                unit: 'month',
                displayFormats: {month: 'MMM', year: 'YYYY'},
                min: min.toString(),
              }
            }],
            yAxes: [{
              ticks: {
                callback(value: number) {
                  return (new CurrencyPipe('en-US')).transform(value, 'E');
                }
              }
            }]
          }
        }
      });
    }

    this.monthly.valueChanges.subscribe(value => {
      this.schedule.data.datasets = this.algorithm.value === 'time' ? this.timer() : this.maximize();
      this.schedule.update();
    });
    return;
  }

  dynamiccolors() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  }
  remap(projection) {
    return projection.reduce((a, m, i) => {
      const date = moment(Date()).add(i, 'month');
      m.forEach(p => {
        a.push({
          label: p.name,
          account: p.account,
          data: [{
            t: date.toDate().toISOString(),
            y: p.balance,
          }]
        })
      })

      return a;
    }, [])
      .reduce((a, d) => {
        if(a.find(b => b.label == d.label)) {
          a.find(b => b.label == d.label).data.push(...d.data);
        } else {
          a.push({
            ...d,
            backgroundColor: this.dynamiccolors()
          });
        }
        return a;
      }, []);
  }

  maximize() {
    /*
    * The goal for this graph will be to maximize the user resources according to the ratio in which they were shared in the initial schedule
    * */
    /* We need to compute the client available funds */
    const available = (this.data.client.income.gross - this.data.client.income.deductions)
    - this.data.client.expenses.reduce((a, e) => Number(e.amount) + Number(a), 0)

    /* Let us first get the new monthly payments.. */
    let monthly = (this.monthly.get('monthly') as FormArray).getRawValue().map(m => Number(m.amount));
    let debts = [ ...this.data.client.debts ];

    const projection = [];
    let i = 0;

    while(debts.length > 0) {
      projection.push(debts.reduce((a, d) => {

        const amount = monthly[debts.indexOf(d)];
        const balance = projection[i - 1]?.find(w => w.account === d.account)?.balance??d.outstanding;

        if(balance > amount) {
          a.push({
            account: d.account,
            balance: balance - amount,
            payment: amount,
            name: d.name,
          });
        } else {

          if((balance) < 1) return a;

          a.push({
            account: d.account,
            balance: 0,
            payment: balance,
            name: d.name
          });

          /*
          * If one of the debts hits a balance of zero then we need to re-allocate the remaining resources to the rest of the remaining
          * debts
          *
          * So then we update the monthly installement and the debts to pay
          * */
          debts = debts.reduce((b, x) => {
            if(d.account !== x.account) {
              b.push(x);
            }

            return b;
          }, []);
          if(this.monthly.get('allocate').value) {
            monthly = debts.map(x => (x.monthly / debts.reduce((m, k) => Number(m) + Number(k.monthly), 0)) * available);
          } else {
            monthly = debts.map(x => (x.monthly / this.data.client.debts.reduce((m, k) => Number(m) + Number(k.monthly), 0)) * available)
          }
        }
        return a;
      }, []));

      i = i + 1;
    }

    return this.remap(projection);
  }
  timer() {
    /*
    * Here we require that the user select a date in which to converge all the debts...
    * */
    let debts = [...this.data.client.debts];
    const date = this.monthly.get('time').value;

    if(date) {
      /* with the number of months we can compute the monthly installment needed to reach the target */
      let monthly = debts.map(d => d.outstanding / (moment(date).diff(moment(d.created), 'months', true)));

      const projection = [];
      let i = 0;

      while(debts.length > 0) {
        projection.push(debts.reduce((a, d) => {

          const amount = monthly[debts.indexOf(d)];
          const balance = projection[i - 1]?.find(w => w.account === d.account)?.balance??d.outstanding;

          if(balance > amount) {
            a.push({
              account: d.account,
              balance: balance - amount,
              payment: amount,
              name: d.name,
            });
          } else {

            if((balance) < 1) return a;

            a.push({
              account: d.account,
              balance: 0,
              payment: balance,
              name: d.name
            });

            /*
            * If one of the debts hits a balance of zero then we need to re-allocate the remaining resources to the rest of the remaining
            * debts
            *
            * So then we update the monthly installement and the debts to pay
            * */
            debts = debts.reduce((b, x) => {
              if(d.account !== x.account) {
                b.push(x);
              }

              return b;
            }, []);
            monthly = debts.map(d => d.outstanding / (moment(date).diff(moment(d.created), 'months', true)));
          }
          return a;
        }, []));

        i = i + 1;
      }
      return this.remap(projection);
    }
  }


  duration(debt: Partial<{outstanding: number, amount: number, account: string}>) {
    const { data } = this.maximize().find((d) => d.account === debt.account);

    return Math.floor(moment(data[data.length - 1].t).diff(moment(data[0].t), 'months', true));
  }
  remainder() {
    const client = this.data.client;
    const nett = Number(client.income.gross) - Number(client.income.deductions);
    const monthly = this.monthly.getRawValue().monthly.reduce((a, e) => Number(a) + Number(e.amount), 0);
    const expenses = this.data.client.expenses.reduce((a, d) => a + Number(d.amount), 0);

    return nett - monthly - expenses;
  }
}
