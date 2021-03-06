import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { RouterModule } from '@angular/router';
import { CounsellorEffect, MetaReducers, Reducers } from "./store";

import routes from './app.routes';
import configuration from './configurations/configuration.json';

import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ServicesModule } from './services/services.module';
import { GuardsModule } from "./guards/guards.module";
import { UserEffect } from "./store/user";
import { ClientEffect } from "./store/clients";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { ToolsEffect } from "./store/tools";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServicesModule,
    GuardsModule,

    StoreModule.forRoot(Reducers, {
      metaReducers: MetaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    EffectsModule.forRoot([
      UserEffect,
      CounsellorEffect,
      ClientEffect,
      ToolsEffect
    ]),

    RouterModule.forRoot(routes),
    StoreRouterConnectingModule.forRoot(),
    SocketIoModule.forRoot({
      url: configuration.socket,
      options: {}
    } as SocketIoConfig),

    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [
    HttpClientModule,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
