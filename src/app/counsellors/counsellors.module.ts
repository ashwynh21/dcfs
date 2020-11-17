import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounsellorsComponent } from './counsellors.component';
import { RouterModule } from "@angular/router";

import routes from './counsellors.routes';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { CounsellorComponent } from './counsellor/counsellor.component';
import { MatRippleModule } from "@angular/material/core";
import { DeleteComponent } from "./delete/delete.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [CounsellorsComponent, CounsellorComponent, DeleteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class CounsellorsModule { }
