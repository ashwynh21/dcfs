import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { CounsellorModel } from "../../../models/counsellor.model";
import { Store } from "@ngrx/store";
import { SelectCounsellor } from "../../../store/counsellor";
import { CreateUser, SelectErrorUser, SelectLoadingUser, UpdateUser } from "../../../store/user";
import { UserModel } from "../../../models/user.model";

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.scss']
})
export class EnrollComponent implements OnInit {
  user: FormGroup;

  counsellor: Observable<CounsellorModel>;
  loading: Observable<boolean>;
  error: Observable<Error>;

  constructor(private dialog: MatDialogRef<EnrollComponent>,
              private builder: FormBuilder,
              private store: Store,
              @Inject(MAT_DIALOG_DATA) public data: {
                user?: UserModel
              }) { }

  ngOnInit(): void {
    this.user = this.builder.group({
      username: [this.data?.user?.username??'', [Validators.required, Validators.email]],
      fullname: [this.data?.user?.fullname??'', Validators.required],
      password: [this.data?.user?.password??'', Validators.required],
      confirm: [this.data?.user?.password??'', Validators.required],
      access: [this.data?.user?.access[0]??'', Validators.required]
    },{validators: this.confirm});

    this.counsellor = this.store.select(SelectCounsellor);
    this.loading = this.store.select(SelectLoadingUser);
    this.error = this.store.select(SelectErrorUser);
  }

  confirm(group: FormGroup) {
    if(group.get('confirm').value == group.get('password').value)
      return true;

    return group.get('confirm').setErrors({notEquivalent: true})
  }

  create() {
    this.counsellor.subscribe(counsellor => {
      if( counsellor ) {
        const user = {
          ...this.user.getRawValue(),
          counsellor: counsellor._id,
          access: [this.user.get('access').value],
          created: (new Date()).toISOString()
        } as Partial<UserModel>;
        this.store.dispatch(CreateUser(user));

        this.loading.subscribe(loading => {
          if(!loading) {
            this.dialog.close();
          }
        });
      }
    }).unsubscribe();
  }

  update() {
    this.counsellor.subscribe(counsellor => {
      if( counsellor ) {
        const user = {
          ...this.user.getRawValue(),
          _id: this.data.user?._id,
          counsellor: counsellor._id,
          access: [this.user.get('access').value],
          created: (new Date()).toISOString()
        } as Partial<UserModel>;

        this.store.dispatch(UpdateUser(user));

        this.loading.subscribe(loading => {
          if(!loading) {
            this.dialog.close();
          }
        });
      }
    }).unsubscribe();
  }
}
