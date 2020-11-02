import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RunUpdate, SelectCompleteCreate, SelectLoadingCreate } from "../../store/user/create";
import { UserModel } from "../../models/user.model";
import { Store } from "@ngrx/store";
import { PersonalComponent } from "../personal/personal.component";
import { Observable } from "rxjs";

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  @Output()
  emitter: EventEmitter<number>;
  @Input()
  user: UserModel;

  loading: Observable<boolean>;

  finance: FormGroup;
  expenses: FormGroup[];

  constructor(private builder: FormBuilder,
              private store: Store) {
    this.emitter = new EventEmitter<number>();
  }

  ngOnInit(): void {
    this.loading = this.store.select(SelectLoadingCreate);

    this.finance = this.builder.group({
      income: this.builder.group({
        statement: [this.user.income?.statement],
        gross: [this.user.income?.gross],
        deductions: [this.user.income?.deductions]
      }),
    });

    this.expenses = [];
    if(this.user.expenses) {
      this.expenses = this.user.expenses.map(expense => {
        return this.builder.group({
          name: [expense.name],
          amount: [expense.amount]
        })
      })
    } else {
      this.expenses.push(this.builder.group({
        name: [undefined],
        amount: [undefined]
      }));
    }
  }

  addexpense() {
    this.expenses.push(this.builder.group({
      name: [undefined],
      amount: [undefined]
    }));
  }
  removeexpense(index) {
    this.expenses = this.expenses.reduce((a, f, i) => {
      if(i == index)
        return a;

      a.push(f);
      return a;
    }, []);
  }

  update(event: Event) {
    event.preventDefault();
    this.store.dispatch(RunUpdate(PersonalComponent.clean({
      ...this.user,
      ...this.finance.getRawValue(),
      expenses: this.expenses.map(expense => ({
        ...expense.getRawValue(),
        created: new Date()
      })),
    }) as UserModel));
    this.store.select(SelectCompleteCreate)
      .subscribe(user => {
        if(user) {
          this.emitter.emit(3);
        }
      });
  }

  upload({ target }: Event) {
    const reader = new FileReader();

    reader.onload = ({  target }) => {
      this.finance.get('income').get('statement').setValue(target.result);
    }
    reader.readAsDataURL((target as HTMLInputElement).files[0]);
  }
}
