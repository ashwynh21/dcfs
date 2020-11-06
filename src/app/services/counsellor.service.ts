import { Injectable } from '@angular/core';
import { ServicesModule } from "./services.module";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../helpers/response";
import configuration from "../configurations/configuration.json";
import { CounsellorModel } from "../models/counsellor.model";

@Injectable({
  providedIn: ServicesModule
})
export class CounsellorService {
  name = 'counsellors';

  constructor(private http: HttpClient) { }

  public read(data: Partial<CounsellorModel>): Observable<Response> {
    return this.http.get(`${configuration.root}${this.name}?${CounsellorService.querystring(CounsellorService.flatten(data))}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public create(data: CounsellorModel): Observable<Response> {
    return this.http.post(`${configuration.root}${this.name}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  static querystring(data: any): string {
    const flat = CounsellorService.flatten(data);

    Object.entries(flat)
      .forEach(([key, value]) => {
        if(!value && !(typeof value == 'number')) {
          delete flat[key];
        }
      });

    return Object.entries(flat)
      .filter(([key, _]) => key !== 'type')
      .map(([key, value]) => `${key}=${value}&`)
      .reduce((p, c) => p.concat(c), '')
      .slice(0, -1);
  }
  static flatten(data: any, prefix?: string) {
    return Object.keys(data).reduce((previous: any, current) => {
      const key = prefix ? `${prefix}.` : '';

      if (typeof data[current] === 'object') {
        Object.assign(previous, this.flatten(data[current], `${key}${current}`));
      } else {
        previous[`${key}${current}`] = data[current];
      }

      return previous;
    }, {});
  }
}
