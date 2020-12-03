import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ClientModel } from "../../models/client.model";
import { CounsellorModel } from "../../models/counsellor.model";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { SelectErrorTools, SelectLoadingTools, SendSchedule } from "../../store/tools";

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {
  emails: FormGroup;
  loading: Observable<boolean>;
  error: Observable<Error>;

  constructor(
    private builder: FormBuilder,
    private dialog: MatDialog,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: {
      client?: ClientModel
      counsellor?: CounsellorModel,
      file: any
    }) { }

  ngOnInit(): void {
    this.loading = this.store.select(SelectLoadingTools);
    this.error = this.store.select(SelectErrorTools);

    this.emails = this.builder.group({
      emails: this.builder.array([
        this.builder.group({
          email: [],
          name: []
        })
      ])
    });
  }

  addmail() {
    (this.emails.controls['emails']['controls']).push(
      this.builder.group({
        name: [''],
        amount: [''],
      })
    );
  }
  removemail(index: number) {
    (this.emails.controls['emails']['controls']).splice(index, 1);
  }

  submit() {
    this.store.dispatch(SendSchedule({
      emails: this.emails.getRawValue().emails,
      client: this.data.client,
      counsellor: this.data.counsellor,
      file: this.data.file
    }));
  }
}
