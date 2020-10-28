import { Routes } from '@angular/router';
import { LanderComponent } from './lander.component';
import { HomeComponent } from "./home/home.component";
import { AuthenticateComponent } from "./authenticate/authenticate.component";

export default [
  {
    path: '',
    component: LanderComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'authenticate',
        component: AuthenticateComponent
      }
    ]
  },
] as Routes;
