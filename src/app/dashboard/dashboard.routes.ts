import { Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";
import { LandComponent } from "./land/land.component";

export default [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: LandComponent
      },
      {
        path: 'clients',
        loadChildren: () =>
          import(
            /* webpackChunkName: "clients" */
            '../clients/clients.module'
            )
            .then(client => client.ClientsModule)
      },
      {
        path: 'counsellors',
        loadChildren: () =>
          import(
            /* webpackChunkName: "counsellors" */
            '../counsellors/counsellors.module'
            )
            .then(counsellors => counsellors.CounsellorsModule)
      }
    ]
  },
] as Routes;
