import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { UserModel } from "../../../models/user.model";
import { RunCreate, SelectCompleteCreate, SelectErrorCreate, SelectLoadingCreate } from "../../../store/user/create";
import { RunAuthenticate, SelectCompleteAuthenticate } from "../../../store/user/authenticate";
import { Router } from "@angular/router";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  signup: FormGroup;

  error: Observable<Error>;
  loading: Observable<boolean>;
  user: Observable<UserModel>;

  constructor(private builder: FormBuilder,
              private store: Store,
              private router: Router) {

    this.signup = builder.group({
      username: ['', [Validators.required, Validators.email]],
      fullname: ['', Validators.required],
      access: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', [Validators.required]]
    }, {validators: this.confirm});

    this.loading = this.store.select(SelectLoadingCreate);
    this.error = this.store.select(SelectErrorCreate);
    this.user = this.store.select(SelectCompleteCreate);

  }

  ngOnInit(): void {
  }

  create() {
    this.store.select(SelectCompleteAuthenticate).subscribe(
    async success => {
      if (success) {
        await this.router.navigate(['dashboard']);
      }
    });
    this.user.subscribe((user) => {
      if (user) {
        this.store.dispatch(RunAuthenticate({
          username: user.username,
          password: user.password
        }));
      }
    });
    this.store.dispatch(RunCreate({
      ...this.signup.getRawValue(),

      access: [this.signup.get('access').value],
      created: new Date(),
      updated: new Date()
    }));
  }

  confirm(group: FormGroup) {
    if(group.get('confirm').value == group.get('password').value)
      return true;

    return group.get('confirm').setErrors({notEquivalent: true})
  }
}
