import { Routes } from "@angular/router";

export default [
  {
    path: '',
    loadChildren: () => import(
      /* webpackChunkName: "profile" */
      './profile/profile.module'
      )
      .then(profile => profile.ProfileModule)
  },
] as Routes;
