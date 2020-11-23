import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { CreateClient, SelectErrorClient, SelectLoadingClient, UpdateClient } from "../../../store/clients";
import { Observable } from "rxjs";
import { ClientModel } from "../../../models/client.model";
import { SelectCounsellor } from "../../../store/counsellor";

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  loading: Observable<boolean>;
  error: Observable<Error>;

  bio: FormGroup;
  income: FormGroup;

  constructor(private dialog: MatDialogRef<PersonalComponent>,
              private store: Store,
              @Inject(MAT_DIALOG_DATA) public data: {
                client?: ClientModel
              },
              private builder: FormBuilder) { }

  ngOnInit(): void {
    this.bio = this.builder.group({
      pin: [this.data.client.pin, [Validators.required, Validators.pattern(/^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{4}[0-9]{3}$/)]],
      fullname: [this.data.client.fullname, Validators.required],
      email: [this.data.client.email, [Validators.required, Validators.email]],
      mobile: [this.data.client.mobile, [Validators.required, Validators.pattern(/^(268)?(\+268)?([7])+([689])+([0-9]{6})$/)]],

      physical: [this.data.client.physical, Validators.required],
      postal: this.builder.group({
        address: [this.data.client.postal.address, Validators.required],
        code: [this.data.client.postal.code],
      }),

      marital: this.builder.group({
        fullname: [this.data.client.marital?.fullname],
        pin: [this.data.client.marital?.pin, Validators.pattern(/^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{4}[0-9]{3}$/)],
        dependents: [this.data.client.marital?.dependents]
      }),
    });
    this.income = this.builder.group({
      employment: this.builder.group({
        name: [this.data.client.employment.name, [Validators.required]],
        postal: this.builder.group({
          address: [this.data.client.employment.postal.address],
          code: [this.data.client.employment.postal.code]
        })
      }),
      income: this.builder.group({
        statement: [this.data.client.income.statement, [Validators.required]],
        gross: [this.data.client.income.gross, [Validators.required]],
        deductions: [this.data.client.income.deductions, [Validators.required]],
      }),
    });
    this.loading = this.store.select(SelectLoadingClient);
    this.error = this.store.select(SelectErrorClient);
  }

  submit() {
    this.store.dispatch(UpdateClient({
      ...this.bio.getRawValue(),
      ...this.income.getRawValue(),
      updated: new Date(),
      _id: this.data.client._id
    }));

    this.loading.subscribe(loading => {
      if(!loading) {
        this.dialog.close();
      }
    })
  }


  upload({ target }: Event) {
    const reader = new FileReader();

    reader.onload = ({target: {result}}) => {
      this.income.get('income').get('statement').setValue(result);
    }
    reader.readAsDataURL((target as HTMLInputElement).files[0]);
  }

}
