import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
    ActivatedRoute,
    NavigationEnd,
    NavigationStart,
    Router,
} from "@angular/router";
import { filter } from "rxjs";
import { UserLoginComponent } from "src/app/user-auth/user-login/user-login.component";
import { CustomerAuthService } from "../../api/customer-auth.service";
import { MatSidenav } from "@angular/material/sidenav";

import { FormBuilder } from "@angular/forms";
import { environment } from "src/environments/environment";
import { io } from "socket.io-client";
import { OrderService } from "src/app/api/order.service";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
    fixedHeaderFlag = true;
    userLoginFlag = false;
    userDetail = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private customerAuthService: CustomerAuthService,
        public orderService: OrderService
    ) {
        this.socket = io(this.socketApiUrl);

        // add on orderAcceptedOrRejected event listener
        this.socket.on("orderAcceptedOrRejected", (data: any) => {
            console.log("orderAcceptedOrRejected", data);
            this.orderService.checkForOrderWithPendingPayment();
        });

        // join the socket room
        this.socket.on("connect", () => {
            this.socket.emit("joinCustomerRoom", this.customerAuthService.getUserDetail()?._id);
        });
    }

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    socketOrderPlacedEvent = "orderPlaced";

    socketOrderPlaced(data: any) {
        this.socket.emit(this.socketOrderPlacedEvent, data);
    }

    ngOnInit(): void {
        this.getCurrentRoute();
        this.checkLogin();
    }
    logout() {
        this.router.navigateByUrl("/");
        this.customerAuthService.removeToken();
    }
    checkLogin() {
        this.customerAuthService.customerDetail.subscribe({
            next: (res) => {
                if (res) {
                    this.userLoginFlag = true;
                    this.userDetail = res;
                } else {
                    this.userDetail = res;
                    this.userLoginFlag = false;
                }
            },
        });
    }
    getCurrentRoute() {
        this.route.queryParams.subscribe((params: any) => {
            if (params && params?.detail) {
                this.fixedHeaderFlag = false;
            } else {
                this.fixedHeaderFlag = true;
            }
        });
    }
    openLoginDialog() {
        this.dialog.open(UserLoginComponent, {
            minWidth: "400px",

            disableClose: true,
        });
    }
}
