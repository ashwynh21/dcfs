import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';

import routes from './profile.routes';
import { RouterModule } from "@angular/router";
import { PanelComponent } from './beginner/panel/panel.component';
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { BioComponent } from './beginner/bio/bio.component';
import { IncomeComponent } from './beginner/income/income.component';
import { DebtComponent } from './beginner/debt/debt.component';
import { MatButtonModule } from "@angular/material/button";
import { StartupComponent } from './beginner/startup/startup.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PersonalComponent } from './beginner/personal/personal.component';
import { FinanceComponent } from './beginner/finance/finance.component';
import { CommitmentComponent } from './beginner/commitment/commitment.component';
import { ReactiveFormsModule } from "@angular/forms";
import { CompleteComponent } from './beginner/complete/complete.component';
import { BeginnerComponent } from './beginner/beginner.component';

@NgModule({
  declarations: [ProfileComponent, PanelComponent, BioComponent, IncomeComponent, DebtComponent, StartupComponent, PersonalComponent, FinanceComponent, CommitmentComponent, CompleteComponent, BeginnerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ]
})
export class ProfileModule { }
