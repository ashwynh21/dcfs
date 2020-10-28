import {Routes} from '@angular/router';

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
    loadChildren: () => import(
      /* webpackChunkName: "dashboard" */
      './dashboard/dashboard.module'
      )
      .then(dashboard => dashboard.DashboardModule)
  }
] as Routes;
