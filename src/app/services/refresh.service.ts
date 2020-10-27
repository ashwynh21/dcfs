import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { Response } from '../helpers/response';
import { ServicesModule } from './services.module';

import configuration from '../configurations/configuration.json';

@Injectable({
  providedIn: ServicesModule
})
export class RefreshService {
  name = 'refresh';

  constructor(private http: HttpClient) { }

  /*
    lets now make a function that will allow the user to create a refresh token for themselves.
   */
  public refresh(data: string): Observable<Response> {
    return this.http.post(
      configuration.root + this.name,
      {
        token: data,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    ).pipe(
      exhaustMap((response) => {
        return of(response);
      })
    );
  }
}
