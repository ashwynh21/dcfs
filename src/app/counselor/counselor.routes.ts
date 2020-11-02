import { Routes } from "@angular/router";

export default [
  {
    path: '',
    loadChildren: () => import(
      /* webpackChunkName: "details" */
      './details/details.module'
      )
      .then(details => details.DetailsModule)
  },
] as Routes;
