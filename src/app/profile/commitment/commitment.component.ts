import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RunUpdate, SelectCompleteCreate, SelectLoadingCreate } from "../../store/user/create";
import { PersonalComponent } from "../personal/personal.component";
import { UserModel } from "../../models/user.model";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

@Component({
  selector: 'app-commitment',
  templateUrl: './commitment.component.html',
  styleUrls: ['./commitment.component.scss']
})
export class CommitmentComponent implements OnInit {
  commitments: FormGroup[];
  @Input()
  user: UserModel;

  @Output()
  public emitter: EventEmitter<number>;

  loading: Observable<boolean>;

  constructor(private builder: FormBuilder,
              private store: Store) {
    this.emitter = new EventEmitter<number>();
  }

  ngOnInit(): void {
    this.loading = this.store.select(SelectLoadingCreate);
    this.commitments = [];

    if(this.user.debt && this.user.debt.length > 0) {
      this.commitments = this.user.debt.map(commitment => {
        return this.builder.group({
          name: [commitment.name],
          account: [commitment.account],
          outstanding: [commitment.outstanding],
          monthly: [commitment.monthly]
        })
      });
    } else {
      this.commitments.push(this.builder.group({
        name: [undefined],
        account: [undefined],
        outstanding: [undefined],
        monthly: [undefined]
      }));
    }
  }

  addcommitment() {
    this.commitments.push(this.builder.group({
      name: [undefined],
      account: [undefined],
      outstanding: [undefined],
      monthly: [undefined]
    }));
  }
  removecommitment(index) {
    this.commitments = this.commitments.reduce((a, f, i) => {
      if(i == index)
        return a;

      a.push(f);
      return a;
    }, []);
  }

  update(event: Event) {
    /*
    * Here we will be submitting the final update for the user...
    * */

    event.preventDefault();

    this.store.dispatch(RunUpdate(PersonalComponent.clean({
      ...this.user,
      debt: this.commitments.map(commitment => ({
        ...commitment.getRawValue(),
        created: new Date()
      })),
    }) as UserModel));
    this.store.select(SelectCompleteCreate)
      .subscribe(user => {
        /*
        * Then we handle the final update here...
        * */
        console.log(user);
        if(user) this.emitter.emit(4);
      });
  }
}
