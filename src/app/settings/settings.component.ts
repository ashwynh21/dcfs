import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CounsellorModel } from "../models/counsellor.model";
import { SelectCounsellor, SelectErrorCounsellor, SelectLoadingCounsellor, UpdateCounsellor } from "../store/counsellor";
import { UpdateClient } from "../store/clients";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  counsellor: Observable<CounsellorModel>;
  loading: Observable<boolean>;
  error: Observable<Error>;

  interest: FormGroup;
  profile: FormGroup;

  constructor(private builder: FormBuilder,
              private store: Store) { }

  ngOnInit(): void {
    this.interest = this.builder.group({
      interest: [],
    });
    this.profile = this.builder.group({
      fsra: [],
      name: [],
    });

    this.loading = this.store.select(SelectLoadingCounsellor);
    this.error = this.store.select(SelectErrorCounsellor);
    this.counsellor = this.store.select(SelectCounsellor);

    this.counsellor.subscribe(counsellor => {
      if(counsellor) {
        this.interest.get('interest').setValue(counsellor.interest);
        this.profile.get('fsra').setValue(counsellor.fsra);
        this.profile.get('name').setValue(counsellor.name);
      }
    })
  }

  update() {
    this.counsellor.subscribe(counsellor => {
      if(counsellor) {
        this.store.dispatch(UpdateCounsellor({
          ...counsellor,
          ...this.profile.getRawValue(),
          ...this.interest.getRawValue(),
        }));
      }
    }).unsubscribe();
  }
}
