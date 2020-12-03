import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ClientModel } from "../../models/client.model";
import { CounsellorModel } from "../../models/counsellor.model";

import Chart, { ChartData, ChartOptions } from "chart.js";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatButtonToggleGroup } from "@angular/material/button-toggle";
import { Observable } from "rxjs";

import xlsx from 'xlsx';
import moment from "moment";
import { MailComponent } from "../mail/mail.component";

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
  percent: number;
  available: number;
  projection: any[];

  loading: Observable<boolean>;
  error: Observable<Error>;

  constructor(
    private builder: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      client?: ClientModel
      counsellor?: CounsellorModel,
    }) {

    this.available = (this.data.client.income.gross - this.data.client.income.deductions)
      - this.data.client.expenses.reduce((a, e) => Number(e.amount) + Number(a), 0);

    this.percent = this.data.counsellor.interest * this.available / 100;

    this.available -= this.percent;

    /* We need to use the percentage to compute the counsellor payment. When the counsellor computes the total available amount from the
    * client, the commission of the counsellor will be computed as the amount available from the client multiplied by the percentage*/

    this.monthly = builder.group({
      monthly: builder.array(
        data.client.debts.map(d => {
          return builder.group({
            ...Object.entries(d).reduce((a, [k, v]) => {
              a[k] = [v];
              return a;
            }, {}),
            amount: [(d.monthly / this.data.client.debts.reduce((a, d) => Number(a) + Number(d.monthly), 0) * this.available).toFixed(2)]
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

    if(this.algorithm?.value == 'time' && date) {
      /* with the number of months we can compute the monthly installment needed to reach the target */
      let monthly = debts.map(d => (d.outstanding / (moment(date).diff(moment(d.created), 'months', true))).toFixed(2));
      /* then we update the form with the new monthly values...
      * i = o / (s - c)
      * */
      this.monthly['controls']['monthly']['controls'].forEach((c, i) => {
        if(monthly[i]) {
          c['controls']['amount'].setValue(monthly[i]);
        }
      });
    } else if(this.algorithm?.value == 'time' && !date) {

      const created = new Date(debts[0].created??(Date()));

      date = moment(created).add(Math.ceil(debts.reduce((a, d) => Number(a) + Number(d.outstanding), 0) / this.available), 'months').toDate();
      this.monthly.get('time').setValue(date);

    } else if(this.algorithm?.value == 'max'){

      (this.monthly['controls']['monthly']['controls'].forEach((c, i) => {
        if(debts[i]) {
          const d = debts[i];
          c['controls']['amount'].setValue((d.monthly / this.data.client.debts.reduce((a, d) => Number(a) + Number(d.monthly), 0) * this.available).toFixed(2));
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
            ...d,
            outstanding: Number(d.outstanding),
            monthly: Number(d.monthly),
            account: d.account,
            balance: balance - amount,
            payment: Number(amount),
            name: d.name,
          });
        } else {
          if((balance) < 1) return a;

          a.push({
            ...d,
            outstanding: Number(d.outstanding),
            monthly: Number(d.monthly),
            account: d.account,
            balance: 0,
            payment: Number(amount),
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
            monthly = debts.map(x => (x.monthly / debts.reduce((m, k) => Number(m) + Number(k.monthly), 0)) * this.available);
          } else {
            monthly = debts.map(x => (x.monthly / this.data.client.debts.reduce((m, k) => Number(m) + Number(k.monthly), 0)) * this.available)
          }
        }
        return a;
      }, []));

      i = i + 1;
    }
    this.projection = projection;

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
              ...d,
              account: d.account,
              balance: balance - amount,
              payment: amount,
              name: d.name,
            });
          } else {

            if((balance) < 1) return a;

            a.push({
              ...d,
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

      this.projection = projection;

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

    return nett - monthly - expenses - this.percent;
  }

  download() {
    const name = `${this.data.client.fullname} (${this.data.counsellor.name}) - ${moment(Date()).format('lll')}`;
    xlsx.writeFile(this.writeworkbook(), `${name}.xlsx`, { bookType: 'xlsx', cellStyles: true, type: 'base64' });
  }
  writeworkbook(): xlsx.WorkBook {

    /* This function will be used to respond to the download button for the schedule
    * Here we need to get the schedule data from the graph computation as well as the
    * graph itself and build the data into an excel file...
    *
    * For this to work we will need to ensure that the projection data is accessible
    * from here.
    * */

    const workbook = xlsx.utils.book_new();

    /*
    * With the workbook made we then add the data in with a new spread sheet...
    * the way we are going to create the file is with the html table system...
    * we will format the table in html allowing us to create the appropriate
    * structure for the system to work properly
    * */
    const table = document.createElement('table') as HTMLTableElement;
    /* Now we add the header fields to the table...
    * */
    this.head(table);
    this.content(table);

    const spreadsheet = xlsx.utils.table_to_sheet(table);
    xlsx.utils.book_append_sheet(workbook, spreadsheet, 'Debt Projection');

    /* Then we write the file to the temp file and trigger the file download...
    * */
    return workbook;
  }

  /*
  * Down here we will define functions that will help us create components for
  * the table component that we want to export to excel...
  * */
  head(table: HTMLTableElement): HTMLTableSectionElement {
    const names =  ['Account', 'Balance', 'Payment', 'Name', 'Outstanding', 'Monthly', 'Date'];
    const head = table.createTHead();
    const titles = head.insertRow(0);

    names.map(name => {
      const cell = titles.insertCell();
      cell.innerText = name;

      return cell;
    });

    head.insertRow(0).insertCell().colSpan = names.length;
    Object.entries(this.data.client).forEach(([k, v], i) => {
      if(typeof v == 'string' && (k !== '_id' && k !== 'counsellor')) {
        const row = head.insertRow(0);
        const cell = row.insertCell();

        cell.setAttribute('style', 'background-color: #0001;');
        cell.colSpan = names.length;

        cell.setAttribute('style', `text-align: left; vertical-align: center; min-height: 128px;`);
        cell.innerHTML = `${k[0].toUpperCase()}${k.substring(1)}: ${v}`;
      }
    });

    return head;
  }
  content(table: HTMLTableElement): HTMLTableSectionElement {
    const date = moment(new Date());
    const body = table.createTBody();

    this.projection.forEach((p, i) => {
      date.add(i, 'month');

      const rows = p.map(m => this.paymentrow(body.insertRow(), m));
      const last = rows[0].insertCell();

      last.rowSpan = rows.length;
      last.innerText = date.format('lll');
    });
    this.graphimage(table);

    return body;
  }

  paymentrow(row: HTMLTableRowElement, m) {
    row.insertCell().innerHTML = m.account.toString();
    row.insertCell().innerHTML = String(Number(m.balance).toFixed(2));
    row.insertCell().innerHTML = String(Number(m.payment).toFixed(2));
    row.insertCell().innerHTML = m.name;
    row.insertCell().innerHTML = String(Number( m.outstanding).toFixed(2));
    row.insertCell().innerHTML = String(Number(m.monthly).toFixed(2));

    return row;
  }
  totalrow(table: HTMLTableElement) {
    const row = table.insertRow();

    row.insertCell().innerText = 'TOTALS';
  }
  graphimage(table: HTMLTableElement) {
    const row = table.insertRow();
    const cell = row.insertCell();

    cell.innerHTML = `<img src="${this.schedule.canvas.toDataURL()}"/>`;
  }

  showemail() {
    this.dialog.open(MailComponent,
      {
        data: {
          projection: this.projection,
          file: xlsx.write(this.writeworkbook(), { type: 'base64' }),
          ...this.data,
        },
        width: '40%',
      })
  }
}
