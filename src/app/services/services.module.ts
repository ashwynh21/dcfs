import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';

/*
in this module we will be placing the http services that the application will be using to communicate with its data store.
 */

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    CookieService
  ]
})
export class ServicesModule { }
