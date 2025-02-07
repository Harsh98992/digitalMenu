import { Component, OnInit } from "@angular/core";
import { RestaurantService } from "./restaurant/api/restaurant.service";
import { AuthenticationService } from "./api/authentication.service";
import { CustomerAuthService } from "./restaurant/api/customer-auth.service";
import { OrderService } from "./api/order.service";
import { Subject } from "rxjs";
import { BnNgIdleService } from "bn-ng-idle";
import { SmartNotificationService } from "./services/smart-notification.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
    title = "QrSay";
    private idleTimer: any;
    private readonly idleDuration = 1800 * 1000; // 4 hours in milliseconds
    public userActivity: Subject<void> = new Subject<void>();
    constructor(
        private authService: AuthenticationService,
        private customerAuthService: CustomerAuthService,
        private orderService: OrderService,
        private bnIdle: BnNgIdleService,
        private notificationService: SmartNotificationService,
    ) {
        this.checkLogin();
    }
    async ngOnInit(): Promise<void> {
        // Request notification permission on startup
        await this.notificationService.showNotification(
            "Welcome to Digital Menu!"
        );

        this.bnIdle
            .startWatching(this.idleDuration)
            .subscribe((isTimedOut: boolean) => {
                if (isTimedOut) {
                    console.log("session expired");
                    this.refreshPage();
                }
            });
    }

    refreshPage(): void {
        window.location.reload();
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
