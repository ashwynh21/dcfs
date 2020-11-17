import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { CreateClient, SelectErrorClient, SelectLoadingClient } from "../../../store/clients";
import { SelectCounsellor } from "../../../store/counsellor";
import { ClientModel } from "../../../models/client.model";
import { scaleLinear } from "d3";
import { UserModel } from "../../../models/user.model";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  loading: Observable<boolean>;
  error: Observable<Error>;
  /*
  * Here we create three forms that the user is going to use to create the client
  * */
  bio: FormGroup;
  income: FormGroup;
  debts: FormGroup;

  indebtedness: BehaviorSubject<number>;
  schedule: BehaviorSubject<number>;

  constructor(private dialog: MatDialogRef<CreateComponent>,
              private store: Store,
              private builder: FormBuilder) { }

  ngOnInit(): void {
    /*
    * Here we initialize the forms with the form builder
    * */
    this.bio = this.builder.group({
      pin: ['', [Validators.required, Validators.pattern(/^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{4}[0-9]{3}$/)]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^(268)?(\+268)?([7])+([689])+([0-9]{6})$/)]],

      physical: ['', Validators.required],
      postal: this.builder.group({
        address: ['', Validators.required],
        code: [''],
      }),

      marital: this.builder.group({
        fullname: [undefined],
        pin: [undefined, Validators.pattern(/^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{4}[0-9]{3}$/)],
        dependents: [undefined]
      }),
    });
    this.income = this.builder.group({
      employment: this.builder.group({
        name: ['', [Validators.required]],
        postal: this.builder.group({
          address: [''],
          code: ['']
        })
      }),
      income: this.builder.group({
        statement: ['', [Validators.required]],
        gross: [0, [Validators.required]],
        deductions: [0, [Validators.required]],
      }),
    });
    this.debts = this.builder.group({
      expenses: this.builder.array([
        this.builder.group({
          name: [''],
          amount: [0],
        })
      ]),
      debts: this.builder.array([
        this.builder.group({
          name: [''],
          account: [''],
          outstanding: [0],
          monthly: [0]
        })
      ])
    });

    this.loading = this.store.select(SelectLoadingClient);
    this.error = this.store.select(SelectErrorClient);

    this.indebtedness = new BehaviorSubject<number>(0);
    this.schedule = new BehaviorSubject<number>(0);
  }
  addexpense() {
    (this.debts.controls['expenses']['controls'] as FormArray).push(
      this.builder.group({
        name: [''],
        amount: [''],
      })
    );

    this.indebtedness.next(this.compute(this.income.getRawValue(), this.debts.getRawValue()));
    this.schedule.next(this.scheduler(this.income.getRawValue(), this.debts.getRawValue()));
  }
  adddebt() {
    (this.debts.controls['debts']['controls'] as FormArray).push(
      this.builder.group({
        name: [''],
        account: [''],
        outstanding: [''],
        monthly: ['']
      })
    );
    this.indebtedness.next(this.compute(this.income.getRawValue(), this.debts.getRawValue()));
    this.schedule.next(this.scheduler(this.income.getRawValue(), this.debts.getRawValue()));
  }
  removeexpense(index) {
    (this.debts.controls['expenses']['controls'] as Array<FormGroup>).splice(index, 1);
    this.indebtedness.next(this.compute(this.income.getRawValue(), this.debts.getRawValue()));
    this.schedule.next(this.scheduler(this.income.getRawValue(), this.debts.getRawValue()));
  }
  removedebt(index) {
    (this.debts.controls['debts']['controls'] as Array<FormGroup>).splice(index, 1);
    this.indebtedness.next(this.compute(this.income.getRawValue(), this.debts.getRawValue()));
    this.schedule.next(this.scheduler(this.income.getRawValue(), this.debts.getRawValue()));
  }

  upload({ target }: Event) {
    const reader = new FileReader();

    reader.onload = ({target: {result}}) => {
      this.income.get('income').get('statement').setValue(result);
    }
    reader.readAsDataURL((target as HTMLInputElement).files[0]);
  }

  submit() {
    const counsellorsubscription = this.store.select(SelectCounsellor)
      .subscribe(counsellor => {
        if(counsellor) {
          const client = CreateComponent.clean({
            ...this.bio.getRawValue(),
            ...this.income.getRawValue(),
            ...this.debts.getRawValue(),
            created: new Date(),
            updated: new Date(),

            counsellor: counsellor._id,
          } as ClientModel) as Partial<ClientModel>;

          this.store.dispatch(CreateClient(client));

          this.loading.subscribe(loading => {
            if(!loading) {
              this.dialog.close();
              counsellorsubscription.unsubscribe();
            }
          })
        }
      });
  }

  scheduler(income, debts): number {
    console.log(Math.floor(Math.max(...debts.debts.map((d) => d.outstanding / d.monthly))));
    return Math.floor(Math.max(...debts.debts.map((d) => d.outstanding / d.monthly)));
  }

  compute(income, debts): number {
    const nett = (income.income.gross - income.income.deductions);
    const expenses = debts.expenses.reduce((a, e) => {
      return a + parseFloat(!CreateComponent.isNumeric(e.amount) ? 0 : e.amount)
    }, 0);
    const commitments = debts.debts.reduce((a, d) => {
      return a + parseFloat(!CreateComponent.isNumeric(d.monthly) ? 0 : d.monthly)
    }, 0);

    const percentage = (nett /* this is the nett pay */
      - (expenses + commitments)) /* this is total expense and debts */
      / nett /* divide by the nett again */;

    return 1 - percentage;
  }

  interpolate(percent: number): string {
    const interpolator = scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(['#080', '#F80', '#800']);

    return interpolator(percent);
  }

  /*
  * We write a function to observe the form changes and pipe them into the indebtment bar
  * */

  static clean(o) {
    return Object.entries(o)
      .reduce((a, [k, v]) => {
        if (v && typeof v === 'object') {
          if(Object.keys(v).length > 0) {
            const d = CreateComponent.clean(v);

            if(Object.keys(d).length > 0)
              a[k] = d;
          }
        }
        else if (v) a[k] = v;

        return a;
      }, o.length ? [] : {});
  }

  static isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str as any) &&
      !isNaN(parseFloat(str))
  }
  bar(percent) {
    return percent > 1 ? 1 : percent
  }
}
