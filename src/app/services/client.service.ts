import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Response } from "../helpers/response";
import { ClientModel } from "../models/client.model";

import configuration from "../configurations/configuration.json";
import { ServicesModule } from "./services.module";
import { CounsellorService } from "./counsellor.service";

@Injectable({
  providedIn: ServicesModule
})
export class ClientService {
  name = 'clients';

  constructor(private http: HttpClient) { }

  public read(data: Partial<ClientModel & {page: number, size: number, length: number}>): Observable<Response> {
    return this.http.get(`${configuration.root}${this.name}?${CounsellorService.querystring(CounsellorService.flatten(data))}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  public create(data: Partial<ClientModel>): Observable<Response> {
    return this.http.post(`${configuration.root}${this.name}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  public update(data: Partial<ClientModel>): Observable<Response> {
    return this.http.put(`${configuration.root}${this.name}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  public delete(data: Partial<ClientModel>): Observable<Response> {
    return this.http.delete(`${configuration.root}${this.name}?${CounsellorService.querystring(CounsellorService.flatten(data))}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
