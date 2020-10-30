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
import { MatDividerModule } from "@angular/material/divider";
import { MenuComponent } from './drawer/menu/menu.component';
import { ItemComponent } from './drawer/menu/item/item.component';

@NgModule({
  declarations: [DashboardComponent, DrawerComponent, ToolbarComponent, ContentComponent, MenuComponent, ItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class DashboardModule { }
