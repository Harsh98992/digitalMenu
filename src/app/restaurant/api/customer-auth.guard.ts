import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { CustomerAuthService } from "./customer-auth.service";

@Injectable({
    providedIn: "root",
})
export class CustomerAuthGuard implements CanActivate {
    constructor(
        private customerAuth: CustomerAuthService,
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
        const res = this.customerAuth.checkUserLogin();
        if (res) {
            return true;
        }
        this.router.navigateByUrl("/");
        return false;
    }
}
