import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { ClientModel } from "../../../models/client.model";
import { Observable } from "rxjs";
import { SelectErrorClient, SelectLoadingClient, UpdateClient } from "../../../store/clients";

@Component({
  selector: 'app-comittments',
  templateUrl: './comittments.component.html',
  styleUrls: ['./comittments.component.scss']
})
export class ComittmentsComponent implements OnInit {
  debts: FormGroup;

  loading: Observable<boolean>;
  error: Observable<Error>;

  constructor(private dialog: MatDialogRef<ComittmentsComponent>,
              private store: Store,
              private builder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: {
                client?: ClientModel
              }) { }

  ngOnInit(): void {
    this.debts = this.builder.group({
      debts: this.builder.array(this.data.client.debts.map(debt =>
        this.builder.group({
          name: [debt.name],
          account: [debt.account],
          outstanding: [debt.outstanding],
          monthly: [debt.monthly]
        })
      ))
    });

    this.loading = this.store.select(SelectLoadingClient);
    this.error = this.store.select(SelectErrorClient);
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
  }
  removedebt(index) {
    (this.debts.controls['debts']['controls'] as Array<FormGroup>).splice(index, 1);
  }
  submit() {
    this.store.dispatch(UpdateClient({
      ...this.data.client,
      ...this.debts.getRawValue()
    }));

    this.loading.subscribe(loading => {
      if(!loading) {
        this.dialog.close();
      }
    })
  }
}
