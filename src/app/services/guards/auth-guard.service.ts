import { IAuth } from './../../utils/Models/Auth';
import { Store } from '@ngrx/store';


import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { AppState } from '../store/app.store';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select("auth").pipe(
      map((auth:IAuth)=>auth.user),
      map(user => {
        if (user.id) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
