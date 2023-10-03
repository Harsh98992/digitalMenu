import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantAuthGuard implements CanLoad {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.authService.getUserToken();
    if (token) {
      return true;
    }
    this.router.navigateByUrl('/admin/login');
    return false;
  }
}
