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
] as Routes;
