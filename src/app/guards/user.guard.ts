import { Injectable } from '@angular/core';
import { UrlTree, CanLoad, Route, UrlSegment } from "@angular/router";
import { Observable } from 'rxjs';
import { Store } from "@ngrx/store";
import { SelectCompleteAuthenticate } from "../store/user/authenticate";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanLoad {
  constructor(private store: Store,) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(SelectCompleteAuthenticate)
      .pipe(
        map(user => {
          return user && !!user.access.find(access => access == 'user');
        })
      );
  }
}
