import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeginnerComponent } from './beginner.component';
import { RouterModule } from "@angular/router";

import routes from './beginner.routes';

@NgModule({
  declarations: [BeginnerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BeginnerModule { }
