import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from "@angular/material/dialog";
import { ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ClientsComponent } from './clients.component';
import { RouterModule } from "@angular/router";

import routes from './clients.routes';
import { MatDividerModule } from "@angular/material/divider";
import { ClientComponent } from './client/client.component';
import { MatMenuModule } from "@angular/material/menu";
import { ProfileComponent } from './profile/profile.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { ScheduleComponent } from './schedule/schedule.component';
import { PersonalComponent } from './profile/personal/personal.component';
import { ExpensesComponent } from './profile/expenses/expenses.component';
import { ComittmentsComponent } from './profile/comittments/comittments.component';
import { DeleteComponent } from "./delete/delete.component";

@NgModule({
  declarations: [ClientsComponent, ClientComponent, ProfileComponent, ScheduleComponent, PersonalComponent, ExpensesComponent, ComittmentsComponent, DeleteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule
  ]
})
export class ClientsModule { }
