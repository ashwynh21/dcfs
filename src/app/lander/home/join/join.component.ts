import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { merge, Observable } from "rxjs";
import { Router } from "@angular/router";
import { CounsellorModel } from "../../../models/counsellor.model";
import { CreateCounsellor, SelectCounsellor, SelectErrorCounsellor, SelectLoadingCounsellor } from "../../../store/counsellor";
import { AuthenticateUser, CreateUser, SelectErrorUser, SelectLoadingUser, SelectUser, SelectUserList } from "../../../store/user";
import { UserModel } from "../../../models/user.model";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  signup: FormGroup;
  authenticate: FormGroup;

  error: Observable<Error>;
  loading: Observable<boolean>;
  counsellor: Observable<CounsellorModel>;
  users: Observable<Array<UserModel>>;
  user: Observable<UserModel>;

  constructor(private builder: FormBuilder,
              private store: Store,
              private router: Router) {

    this.loading = merge(
      this.store.select(SelectLoadingUser),
      this.store.select(SelectLoadingCounsellor)
    );
    this.error = merge(
      this.store.select(SelectErrorUser),
      this.store.select(SelectErrorCounsellor)
    );
    this.counsellor = this.store.select(SelectCounsellor);
    this.users = this.store.select(SelectUserList);
    this.user = this.store.select(SelectUser);

    this.signup = builder.group({
      name: ['', [Validators.required]],
      fsra: ['', Validators.required],
      physical: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^(268)?(\+268)?([7])+([689])+([0-9]{6})$/)]],

      email: ['', [Validators.email]],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    },{validators: this.confirm});
  }

  ngOnInit(): void {
    const counsellorsubscription =  this.counsellor.subscribe(counsellor => {

      if(counsellor) {
        this.store.dispatch(CreateUser({
          username: this.signup.get('email').value,
          password: this.signup.get('password').value,
          counsellor: counsellor._id,
          access: ['admin'],

          created: new Date(),
          updated: new Date(),
        }));
      }
    });

    const usersubscription = this.users.subscribe(users => {
      if(users.find(user => user.username == this.signup.get('email').value)) {
        this.store.dispatch(AuthenticateUser({
          username: this.signup.get('email').value,
          password: this.signup.get('password').value,
        }));

        usersubscription.unsubscribe();
        counsellorsubscription.unsubscribe();
      }
    });

    const singlesubscription = this.user.subscribe(user => {
      if(user) {
        this.router.navigate(['dashboard']);

        singlesubscription.unsubscribe();
      }
    });
  }

  create() {
    this.store.dispatch(CreateCounsellor({
      name: this.signup.get('name').value,
      fsra: this.signup.get('fsra').value,
      physical: this.signup.get('physical').value,
      mobile: this.signup.get('mobile').value,

      created: new Date(),
      updated: new Date(),
    }));
  }

  confirm(group: FormGroup) {
    if(group.get('confirm').value == group.get('password').value)
      return true;

    return group.get('confirm').setErrors({notEquivalent: true})
  }

}
