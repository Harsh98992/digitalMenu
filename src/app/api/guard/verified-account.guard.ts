import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { RestaurantPanelService } from "../restaurant-panel.service";

@Injectable({
    providedIn: "root",
})
export class VerifiedAccountGuard implements CanActivate {
    constructor(
        private restaurantPanelService: RestaurantPanelService,
        private authService: AuthenticationService
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const data = this.restaurantPanelService.getRestaurantStatus();

        if (data && data === "true") {
            return true;
        }

        return false;
    }
}
