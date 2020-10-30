import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanderComponent } from './lander.component';
import { RouterModule } from '@angular/router';

import routes from './lander.routes';
import { MatRippleModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SearchComponent } from './search/search.component';
import { LeftComponent } from './home/left/left.component';
import { JoinComponent } from './home/join/join.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";
import { FooterComponent } from './home/footer/footer.component';
import { AboutComponent } from './home/about/about.component';
import { HomeComponent } from './home/home.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { SigninComponent } from "./authenticate/signin/signin.component";
import { RecoverComponent } from "./authenticate/recover/recover.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { AlreadyComponent } from "./authenticate/already/already.component";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [
    LanderComponent,
    SearchComponent,
    LeftComponent,
    JoinComponent,
    NavigationComponent,
    FooterComponent,
    AboutComponent,
    HomeComponent,
    AuthenticateComponent,
    SigninComponent,
    RecoverComponent,
    AlreadyComponent,
  ],
  imports: [
    CommonModule,

    RouterModule.forChild(routes),
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDialogModule
  ]
})
export class LanderModule { }
