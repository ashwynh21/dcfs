import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UserModel } from "../../models/user.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { RunUpdate, SelectCompleteCreate, SelectLoadingCreate } from "../../store/user/create";
import { Observable } from "rxjs";

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  @Input()
  user: UserModel;
  @Output()
  emitter: EventEmitter<number>;

  loading: Observable<boolean>;
  error: Observable<Error>;

  personal: FormGroup;

  constructor(private builder: FormBuilder,
              private store: Store) {
  }

  ngOnInit(): void {
    this.emitter = new EventEmitter<number>();

    this.loading = this.store.select(SelectLoadingCreate);
    /*
    * We then construct the form here...
    * */
    this.personal = this.builder.group({
      pin: [this.user.bio.pin, Validators.pattern(/^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{4}[0-9]{3}$/)],
      mobile: [this.user.bio.mobile, Validators.pattern(/^(268)?(\+268)?([7])+([689])+([0-9]{6})$/)],
      physical: [this.user.bio.physical],
      postal: this.builder.group({
        address: [this.user.bio.postal?.address],
        code: [this.user.bio.postal?.code]
      }),
      marital: this.builder.group({
        fullname: [this.user.bio.marital?.fullname],
        pin: [this.user.bio.marital?.pin, Validators.pattern(/^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{4}[0-9]{3}$/)],
        dependents: [this.user.bio.marital?.dependents]
      })
    });
  }

  submit(event: Event) {
    event.preventDefault();

    this.store.dispatch(RunUpdate(PersonalComponent.clean({
      ...this.user,
      bio: {
        ...this.personal.getRawValue()
      }
    }) as UserModel));
    this.store.select(SelectCompleteCreate)
      .subscribe(user => {
        if(user) {
          this.emitter.emit(2);
        }
      })
  }

  static clean(o) {
    return Object.entries(o)
      .reduce((a, [k, v]) => {
        if (v && typeof v === 'object') {
          if(Object.keys(v).length > 0) {
            const d = PersonalComponent.clean(v);

            if(Object.keys(d).length > 0)
              a[k] = d;
          }
        }
        else if (v) a[k] = v;

        return a;
      }, o.length ? [] : {});
  }
}
