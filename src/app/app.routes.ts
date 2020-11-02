import {Routes} from '@angular/router';
import { DashboardGuard } from "./guards/dashboard.guard";

export default [
  {
    path: '',
    loadChildren: () => import(
      /* webpackChunkName: "lander" */
      './lander/lander.module'
      )
      .then(lander => lander.LanderModule)
  },
  {
    path: 'dashboard',
    canActivate: [DashboardGuard],
    loadChildren: () => import(
      /* webpackChunkName: "dashboard" */
      './dashboard/dashboard.module'
      )
      .then(dashboard => dashboard.DashboardModule)
  }
] as Routes;
