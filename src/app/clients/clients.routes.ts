
import { ClientsComponent } from "./clients.component";
import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";

export default [
  {
    path: '',
    component: ClientsComponent,
  },
  {
    path: ':id',
    component: ProfileComponent
  }
] as Routes;
