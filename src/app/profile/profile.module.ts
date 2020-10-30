import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';

import routes from './profile.routes';
import { RouterModule } from "@angular/router";
import { PanelComponent } from './panel/panel.component';
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { BioComponent } from './bio/bio.component';
import { IncomeComponent } from './income/income.component';
import { DebtComponent } from './debt/debt.component';
import { MatButtonModule } from "@angular/material/button";
import { StartupComponent } from './startup/startup.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PersonalComponent } from './personal/personal.component';
import { FinanceComponent } from './finance/finance.component';
import { CommitmentComponent } from './commitment/commitment.component';

@NgModule({
  declarations: [ProfileComponent, PanelComponent, BioComponent, IncomeComponent, DebtComponent, StartupComponent, PersonalComponent, FinanceComponent, CommitmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileModule { }
