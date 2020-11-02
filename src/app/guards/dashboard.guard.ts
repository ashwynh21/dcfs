import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { GuardsModule } from './guards.module';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: GuardsModule
})
export class DashboardGuard implements CanActivate {
  /*
  * Okay so in here we simply check if the user profile is cached into the cookie service and then return the corresponding truth value
  * */
  constructor(private cookies: CookieService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const value = this.check();

    if(!value) {
      this.router.navigate(['']);
    }

    return value;
  }

  check(): boolean {
    return this.cookies.check('user');
  }
}
