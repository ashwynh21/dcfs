import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from "@angular/router";

import routes from './dashboard.routes';
import { DrawerComponent } from './drawer/drawer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ContentComponent } from './content/content.component';
import { MenuComponent } from './drawer/menu/menu.component';
import { ItemComponent } from './drawer/menu/item/item.component';
import { LandComponent } from './land/land.component';
import { ProfileComponent } from './land/profile/profile.component';
import { GeneralComponent } from './land/general/general.component';
import { WelcomeComponent } from './land/welcome/welcome.component';
import { CreateComponent } from "./land/create/create.component";
import { MatStepperModule } from "@angular/material/stepper";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { EnrollComponent } from './land/enroll/enroll.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatRippleModule } from "@angular/material/core";

@NgModule({
  declarations: [DashboardComponent, DrawerComponent, ToolbarComponent, ContentComponent, MenuComponent, ItemComponent, LandComponent, ProfileComponent, GeneralComponent, WelcomeComponent, CreateComponent, EnrollComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatSelectModule,
    MatRippleModule
  ]
})
export class DashboardModule { }
