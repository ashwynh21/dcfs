import { Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";

export default [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => import(
          /* webpackChunkName: "user" */
          '../user/user.module'
          )
          .then(user => user.UserModule)
      },
      {
        path: 'counselor',
        loadChildren: () => import(
          /* webpackChunkName: "counselor" */
          '../counselor/counselor.module'
          )
          .then(counselor => counselor.CounselorModule)
      },
    ]
  },
] as Routes;
