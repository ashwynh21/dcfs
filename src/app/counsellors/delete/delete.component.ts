import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserModel } from "../../models/user.model";
import { RemoveUser, SelectLoadingUser } from "../../store/user";

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  confirm: FormGroup;
  loading: Observable<boolean>;

  constructor(
    private store: Store,
    private builder: FormBuilder,
    public dialog: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      user: UserModel
    }) { }

  ngOnInit(): void {
    this.confirm = this.builder.group({
      confirm: ['', [
        Validators.required,
        Validators.pattern(this.data.user.username)
      ]]
    })
    this.loading = this.store.select(SelectLoadingUser);
  }

  submit() {
    this.store.dispatch(RemoveUser({
      _id: this.data.user._id
    }));
    this.loading.subscribe((loading) => {
      if (!loading) {
        this.dialog.close();
      }
    });
  }
}
