import { Component } from "@angular/core";
import { RestaurantService } from "./restaurant/api/restaurant.service";
import { AuthenticationService } from "./api/authentication.service";
import { CustomerAuthService } from "./restaurant/api/customer-auth.service";
import { OrderService } from "./api/order.service";
import { Subject } from "rxjs";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    title = "QrSay";
    private idleTimer: any;
    private readonly idleDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    public userActivity: Subject<void> = new Subject<void>();
    constructor(
        private authService: AuthenticationService,
        private customerAuthService: CustomerAuthService,
        private orderService: OrderService
    ) {
        this.checkLogin();
        this.startIdleTimer();
    }
    startIdleTimer(): void {
        this.resetIdleTimer();
        // Listen for mouse and touch events
        document.addEventListener("mousemove", () => this.onUserActivity());
        document.addEventListener("touchstart", () => this.onUserActivity());
        document.addEventListener("keydown", () => this.onUserActivity());
        document.addEventListener("scroll", () => this.onUserActivity());
    }
    resetIdleTimer(): void {
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(
            () => this.refreshPage(),
            this.idleDuration
        );
    }

    refreshPage(): void {
        window.location.reload();
    }

    private onUserActivity(): void {
        this.userActivity.next();
        this.resetIdleTimer();
    }
    checkLogin() {
        if (this.authService.getUserToken()) {
            this.authService.userDetail.next(this.authService.getUserDetail());
        }
        if (this.customerAuthService.checkUserLogin()) {
            this.customerAuthService.setUserDetail(
                this.customerAuthService.getUserDetail()
            );
        }
    }
}
