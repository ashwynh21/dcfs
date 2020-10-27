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
import { LeftComponent } from './left/left.component';
import { JoinComponent } from './join/join.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [LanderComponent, SearchComponent, LeftComponent, JoinComponent, NavigationComponent],
  imports: [
    CommonModule,

    RouterModule.forChild(routes),
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class LanderModule { }
