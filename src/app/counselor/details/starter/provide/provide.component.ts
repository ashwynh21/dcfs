import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UserModel } from "../../../../models/user.model";
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { RunUpdate, SelectCompleteCreate, SelectLoadingCreate } from "../../../../store/user/create";
import { PersonalComponent } from "../../../../user/profile/beginner/personal/personal.component";

@Component({
  selector: 'app-provide',
  templateUrl: './provide.component.html',
  styleUrls: ['./provide.component.scss']
})
export class ProvideComponent implements OnInit {
  @Input()
  user: UserModel;
  @Output()
  emitter: EventEmitter<number>;

  loading: Observable<boolean>;
  error: Observable<Error>;

  details: FormGroup;

  constructor(private builder: FormBuilder,
              private store: Store) {
  }

  ngOnInit(): void {
    this.emitter = new EventEmitter<number>();

    this.loading = this.store.select(SelectLoadingCreate);
    /*
    * We then construct the form here...
    * */
    this.details = this.builder.group({
      name: [this.user.registration?.name],
      fsra: [this.user.registration?.fsra],
      mobile: [this.user.registration?.mobile, Validators.pattern(/^(268)?(\+268)?([7])+([689])+([0-9]{6})$/)],
      physical: [this.user.registration?.physical],
    });
  }

  submit(event: Event) {
    event.preventDefault();

    this.store.dispatch(RunUpdate(PersonalComponent.clean({
      ...this.user,
      registration: this.details.getRawValue(),
    }) as UserModel));
    this.store.select(SelectCompleteCreate)
      .subscribe(user => {
        if(user) {
          this.emitter.emit(2);
        }
      })
  }
}
