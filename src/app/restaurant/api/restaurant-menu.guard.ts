import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
    ActivatedRouteSnapshot,
    CanDeactivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { Location } from "@angular/common";
import { RestaurantService } from "./restaurant.service";

@Injectable({
    providedIn: "root",
})
export class RestaurantMenuGuard implements CanDeactivate<unknown> {
    constructor(
        private dialog: MatDialog,
        private router: Router,
        private location: Location,
        private restaurantService: RestaurantService
    ) {}
    canDeactivate(
        component: unknown,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (
            this.dialog.openDialogs.length &&
            !this.restaurantService.bypassGaurd
        ) {
            this.dialog.closeAll();
            const currentUrlTree = this.router.createUrlTree([], currentRoute);
            const currentUrl = currentUrlTree.toString();
            this.location.go(currentUrl);

            return false;
        }
        if (this.restaurantService.bypassGaurd) {
            this.restaurantService.bypassGaurd = false;
            // return false
        }

        return true;
    }
}
