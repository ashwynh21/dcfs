import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { SelectErrorClient, SelectLoadingClient, UpdateClient } from "../../../store/clients";
import { Observable } from "rxjs";
import { ClientModel } from "../../../models/client.model";

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  loading: Observable<boolean>;
  error: Observable<Error>;

  bio: FormGroup;

  constructor(private dialog: MatDialogRef<PersonalComponent>,
              private store: Store,
              @Inject(MAT_DIALOG_DATA) public data: {
                client?: ClientModel
              },
              private builder: FormBuilder) { }

  ngOnInit(): void {
    this.bio = this.builder.group({
      pin: [this.data.client.pin, [Validators.required, Validators.pattern(/^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{4}[0-9]{3}$/)]],
      fullname: [this.data.client.fullname, Validators.required],
      email: [this.data.client.email, [Validators.required, Validators.email]],
      mobile: [this.data.client.mobile, [Validators.required, Validators.pattern(/^(268)?(\+268)?([7])+([689])+([0-9]{6})$/)]],

      physical: [this.data.client.physical, Validators.required],
      postal: this.builder.group({
        address: [this.data.client.postal.address, Validators.required],
        code: [this.data.client.postal.code],
      }),

      marital: this.builder.group({
        fullname: [this.data.client.marital?.fullname],
        pin: [this.data.client.marital?.pin, Validators.pattern(/^[0-9]{2}[0,1][0-9][0-3][0-9][0-9]{4}[0-9]{3}$/)],
        dependents: [this.data.client.marital?.dependents]
      }),
    });
    this.loading = this.store.select(SelectLoadingClient);
    this.error = this.store.select(SelectErrorClient);
  }

  submit() {
    this.store.dispatch(UpdateClient({
      ...this.bio.getRawValue(),
      _id: this.data.client._id
    }));

    this.loading.subscribe(loading => {
      if(!loading) {
        this.dialog.close();
      }
    })
  }
}
