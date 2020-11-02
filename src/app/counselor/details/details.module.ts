import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule } from "@angular/router";

import routes from './details.routes';
import { StarterComponent } from './starter/starter.component';
import { WelcomeComponent } from "./starter/welcome/welcome.component";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";
import { RegistrationComponent } from './starter/registration/registration.component';
import { BeginComponent } from './starter/begin/begin.component';
import { MatButtonModule } from "@angular/material/button";
import { ProvideComponent } from './starter/provide/provide.component';
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DoneComponent } from './starter/done/done.component';

@NgModule({
  declarations: [DetailsComponent, StarterComponent, WelcomeComponent, RegistrationComponent, BeginComponent, ProvideComponent, DoneComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class DetailsModule { }
