import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicesModule } from './services.module';

import { CookieService } from 'ngx-cookie-service';
import { Response } from '../helpers/response';
import { UserModel } from '../models/user.model';
import { Observable, of } from 'rxjs';

import configuration from '../configurations/configuration.json';

@Injectable({
  providedIn: ServicesModule
})
export class UserService {
  public name = 'user';
  /*
  this service much like the node service API and its frame architecture will serve as the client side liaison.
   */

  constructor(private http: HttpClient, private cookies: CookieService) { }

  public recover(username: string): Observable<Response> {
    return this.http.post<Response>(
      configuration.root + this.name + '/recover',
      {
        username
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
  }

  public signout(): Observable<boolean> {
    if (this.cookies.check('user')) {
      this.cookies.delete('user');

      return of(true);
    }

    return of(false);
  }

  public getuser(): UserModel {
    if (this.cookies.check('user')) {
      return JSON.parse(this.cookies.get('user'));
    }
  }

  public create(data: UserModel): Observable<Response> {
    return this.http.post(`${configuration.root}${this.name}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  public update(data: UserModel): Observable<Response> {
    if (this.cookies.check('user')) {
      const user: UserModel = JSON.parse(this.cookies.get('user'));

      return this.http.put(`${configuration.root}${this.name}`,
        {...data, token: user.token},
        {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }
  }

  public delete(data: {user: string}): Observable<Response> {
    if (this.cookies.check('user')) {
      const user: UserModel = JSON.parse(this.cookies.get('user'));

      return this.http.delete(`${configuration.root}${this.name}?token=${user.token}&user=${data.user}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }

  public read(data: {_id: string}): Observable<Response> {
    return this.http.get(`${configuration.root}${this.name}?_id=${data._id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
