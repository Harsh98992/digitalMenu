import { Component } from "@angular/core";
import { RestaurantService } from "./restaurant/api/restaurant.service";
import { AuthenticationService } from "./api/authentication.service";
import { CustomerAuthService } from "./restaurant/api/customer-auth.service";
import { OrderService } from "./api/order.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    title = "QrSay";
    constructor(
        private authService: AuthenticationService,
        private customerAuthService: CustomerAuthService,
        private orderService: OrderService
    ) {
        this.checkLogin();
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
