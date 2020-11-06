import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthenticateUser, SelectErrorUser, SelectLoadingUser, SelectUser } from "../../../store/user";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @Input() color: ThemePalette;
  @Output() tabbed = new EventEmitter();

  signinform: FormGroup;
  matcher = new SigninErrorStateMatcher();

  error: Observable<Error>;
  loading: Observable<boolean>;

  visibility = false;

  constructor(private formbuilder: FormBuilder,
              private store: Store,
              private router: Router) {}

  ngOnInit(): void {
    this.signinform = this.formbuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
      ])
    })

    this.error = this.store.select(SelectErrorUser);
    this.loading = this.store.select(SelectLoadingUser);
  }

  /*
  ok lets also make the function that will allow to login using a phepha sign up account...
   */
  signin() {
    /*
    * We have to subscribe here in case the user has already signed in...
    * */
    this.store.select(SelectUser)
      .subscribe(
        async success => {
          if (success) {
            await this.router.navigate(['dashboard']);
          }
        },
      );

    this.store.dispatch(AuthenticateUser({
      username: this.signinform.get('username').value,
      password: this.signinform.get('password').value
    }));
  }
}

/*
here we will always place helper classes
 */
export class SigninErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
