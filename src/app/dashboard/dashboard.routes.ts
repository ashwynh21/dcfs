import { Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";

export default [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () => import(
          /* webpackChunkName: "profile" */
          '../profile/profile.module'
          )
          .then(profile => profile.ProfileModule)
      },
      {
        path: 'welcome',
        loadChildren: () => import(
          /* webpackChunkName: "beginner" */
          '../beginner/beginner.module'
        )
        .then(beginner => beginner.BeginnerModule)
      },
    ]
  },
] as Routes;
