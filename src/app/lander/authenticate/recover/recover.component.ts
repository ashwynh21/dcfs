import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RunRecover, SelectCompleteRecover, SelectErrorRecover, SelectLoadingRecover } from '../../../store/user/recover';
import { Response } from '../../../helpers/response';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

  @Input() color: ThemePalette;
  @Output() tabbed = new EventEmitter<void>();

  recoverform: FormGroup;
  matcher = new RecoverErrorStateMatcher();

  error: Observable<Error>;
  recover: Observable<Response>;
  loading: Observable<boolean>;

  constructor(private formbuilder: FormBuilder,
              private store: Store) { }

  ngOnInit(): void {
    this.recoverform = this.formbuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    });

    this.error = this.store.select(SelectErrorRecover);
    this.recover = this.store.select(SelectCompleteRecover);
    this.loading = this.store.select(SelectLoadingRecover);
  }

  public recovery() {
    this.store.dispatch(RunRecover(
      {username: this.recoverform.get('username').value}
    ));
  }
}

/*
here we will always place helper classes
 */
export class RecoverErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
