import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from "@angular/router";

import routes from './dashboard.routes';
import { DrawerComponent } from './drawer/drawer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ContentComponent } from './content/content.component';
import { MatRippleModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [DashboardComponent, DrawerComponent, ToolbarComponent, ContentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRippleModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DashboardModule { }
