import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { ClientModel } from "../../../models/client.model";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { SelectErrorClient, SelectLoadingClient, UpdateClient } from "../../../store/clients";

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  debts: FormGroup;

  error: Observable<Error>;
  loading: Observable<boolean>;

  constructor(private dialog: MatDialogRef<ExpensesComponent>,
              private store: Store,
              @Inject(MAT_DIALOG_DATA) public data: {
                client?: ClientModel
              },
              private builder: FormBuilder) { }

  ngOnInit(): void {
    this.debts = this.builder.group({
      expenses: this.builder.array(this.data.client.expenses.map(expense => this.builder.group({
        name: [expense.name],
        amount: [expense.amount],
      }))),
    });

    this.error = this.store.select(SelectErrorClient);
    this.loading = this.store.select(SelectLoadingClient);
  }

  addexpense() {
    (this.debts.controls['expenses']['controls'] as FormArray).push(
      this.builder.group({
        name: [''],
        amount: [''],
      })
    );
  }
  removeexpense(index) {
    (this.debts.controls['expenses']['controls'] as Array<FormGroup>).splice(index, 1);
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
    });
  }
  totaldebts() {
    return this.data.client.debts.reduce((a, e) => Number(a) + Number(e.monthly), 0);
  }

  remainder() {
    const client = this.data.client;
    const nett = Number(client.income.gross) - Number(client.income.deductions);
    const expenses = this.debts.getRawValue().expenses.reduce((a, e) => Number(a) + Number(e.amount), 0);
    const debts = this.data.client.debts.reduce((a, d) => a + d.monthly, 0);

    return nett - expenses - debts;
  }
}
