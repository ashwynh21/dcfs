import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { CreateClient, SelectErrorClient, SelectLoadingClient } from "../../../store/clients";
import { SelectCounsellor } from "../../../store/counsellor";
import { ClientModel } from "../../../models/client.model";

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

  constructor(private dialog: MatDialogRef<CreateComponent>,
              private store: Store,
              private builder: FormBuilder) { }

  ngOnInit(): void {
    this.loading = this.store.select(SelectLoadingClient);
    this.error = this.store.select(SelectErrorClient);
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
        gross: ['', [Validators.required]],
        deductions: ['', [Validators.required]],
      }),
    });
    this.debts = this.builder.group({
      expenses: this.builder.array([
        this.builder.group({
          name: ['', [Validators.required]],
          amount: ['', [Validators.required]],
        })
      ]),
      debts: this.builder.array([
        this.builder.group({
          name: ['', [Validators.required]],
          account: ['', [Validators.required]],
          outstanding: ['', [Validators.required]],
          monthly: ['', [Validators.required]]
        })
      ])
    })
  }
  addexpense() {
    (this.debts.controls['expenses']['controls'] as FormArray).push(
      this.builder.group({
        name: ['', [Validators.required]],
        amount: ['', [Validators.required]],
      })
    )
  }
  adddebt() {
    (this.debts.controls['debts']['controls'] as FormArray).push(
      this.builder.group({
        name: ['', [Validators.required]],
        account: ['', [Validators.required]],
        outstanding: ['', [Validators.required]],
        monthly: ['', [Validators.required]]
      })
    )
  }
  removeexpense(index) {
    this.debts.controls['expenses']['controls'] = (this.debts.controls['expenses']['controls'] as Array<FormGroup>).splice(index, 1);
  }
  removedebt(index) {
    this.debts.controls['debts']['controls'] = (this.debts.controls['debts']['controls'] as Array<FormGroup>).splice(index, 1);
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
}
