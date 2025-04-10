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
import { SmartNotificationService } from "src/app/services/smart-notification.service";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
    fixedHeaderFlag = true;
    userLoginFlag = false;
    userDetail = null;
    orderCount: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private customerAuthService: CustomerAuthService,
        public orderService: OrderService,
        private notificationService: SmartNotificationService
    ) {
        this.socket = io(this.socketApiUrl);

        // add on orderAcceptedOrRejected event listener
        this.socket.on("orderAcceptedOrRejected", (data: any) => {
            console.log("orderAcceptedOrRejected", data);
            this.orderService.checkForOrderWithPendingPayment();
            this.getCustomerActiveOrder();
        });

        // join the socket room
        this.socket.on("connect", () => {
            this.socket.emit(
                "joinCustomerRoom",
                this.customerAuthService.getUserDetail()?._id
            );
        });
    }

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    checkIfhomepage = true;
    currentUrl = "";

    socketOrderPlacedEvent = "orderPlaced";

    socketOrderPlaced(data: any) {
        this.socket.emit(this.socketOrderPlacedEvent, data);
    }

    async ngOnInit(): Promise<void> {
        // Initialize notifications in Layout component
        this.notificationService.initializeNotificationSchedule();

        // Show welcome notification when layout loads
        await this.notificationService.showNotification(
            "Welcome to Digital Menu!"
        );

        // get current url
        this.currentUrl = this.router.url;

        // check if current url is homepage http://localhost:4200/restaurant?detail=PAG
        this.updateHomepageFlag();

        // Subscribe to router events to update the homepage flag when the route changes
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.currentUrl = event.url;
                this.updateHomepageFlag();
            }
        });

        this.getCurrentRoute();
        this.checkLogin();
    }

    logout() {
        this.router.navigateByUrl("/");
        this.customerAuthService.removeToken();
    }

    /**
     * Update the homepage flag based on the current URL
     */
    updateHomepageFlag() {
        // If URL includes 'restaurant' and has a detail parameter, it's a restaurant page
        if (
            this.currentUrl.includes("restaurant") &&
            this.currentUrl.includes("detail=")
        ) {
            this.checkIfhomepage = false;
        } else {
            this.checkIfhomepage = true;
        }
    }

    checkLogin() {
        this.customerAuthService.customerDetail.subscribe({
            next: (res) => {
                if (res) {
                    this.userLoginFlag = true;
                    this.userDetail = res;
                    this.getCustomerActiveOrder();
                } else {
                    this.userDetail = res;
                    this.userLoginFlag = false;
                }
            },
        });
    }

    getCustomerActiveOrder() {
        this.orderService.getCustomerActiveOrder().subscribe({
            next: (res: any) => {
                if (res && res?.data?.orderData) {
                    this.orderCount = res?.data?.orderData?.length;
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
