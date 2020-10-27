import { Injectable } from '@angular/core';
import { ServicesModule } from './services.module';
import { HttpClient } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { Response } from '../helpers/response';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs';

import configuration from '../configurations/configuration.json';

@Injectable({
  providedIn: ServicesModule
})
export class AccessService {
  public name = 'access';
  /*
  this service much like the node service API and its frame architecture will serve as the client side liaison.
   */

  constructor(
    private http: HttpClient,
    private cookie: CookieService) { }

  /*
  so let us create the two functions that will allow the user to gain access either through email and password or through external account
  access.
   */
  public access(data: {
    username: string,
    password: string,
  }): Observable<UserModel> {
    return this.http.post<Response>(
      configuration.root + this.name,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    ).pipe(
      map((response) => {
        this.cookie.set('user', JSON.stringify(response.payload));

        return response.payload as UserModel;
      })
    );
  }
}
