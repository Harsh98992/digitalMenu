import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../authentication.service";

@Injectable({
    providedIn: "root",
})
export class RestaurntOwnerGuard implements CanActivate, CanActivateChild {
    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const data = this.authService.getUserDetail();

        if (data && data.role === "restaurantOwner") {
            return true;
        }
        this.router.navigateByUrl("/admin");
        return false;
    }
    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const data = this.authService.getUserDetail();

        if (data && data.role === "restaurantOwner") {
            return true;
        }
        this.router.navigateByUrl("/admin");
        return false;
    }
}
