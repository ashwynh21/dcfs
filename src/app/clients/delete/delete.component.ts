import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserModel } from "../../models/user.model";
import { RemoveUser, SelectLoadingUser } from "../../store/user";
import { ClientModel } from "../../models/client.model";
import { RemoveClient, SelectLoadingClient } from "../../store/clients";
import { Router } from "@angular/router";

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
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {
      client: ClientModel
    }) { }

  ngOnInit(): void {
    this.confirm = this.builder.group({
      confirm: ['', [
        Validators.required,
        Validators.pattern(this.data.client.email)
      ]]
    })
    this.loading = this.store.select(SelectLoadingClient);
  }

  submit() {
    this.store.dispatch(RemoveClient(this.data.client));
    this.loading.subscribe((loading) => {
      if (!loading) {
        this.router.navigate(['../']);
        this.dialog.close();
      }
    });
  }
}
