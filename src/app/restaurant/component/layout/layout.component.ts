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
import { RestaurantService } from "../../api/restaurant.service";
import { CallWaiterDialogComponent } from "../restaurant-menu/call-waiter-dialog/call-waiter-dialog.component";
import { UtilService } from "src/app/api/util.service";

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
    showCallWaiterButton = false;
    currentRestaurantData: any = null;
    tableData: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private customerAuthService: CustomerAuthService,
        public orderService: OrderService,
        private notificationService: SmartNotificationService,
        private restaurantService: RestaurantService,
        private utilService: UtilService
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
            this.loadRestaurantData();
        } else {
            this.checkIfhomepage = true;
            this.showCallWaiterButton = false;
        }
    }

    loadRestaurantData() {
        // Extract restaurant URL from the current URL
        const urlParams = new URLSearchParams(this.currentUrl.split("?")[1]);
        const restaurantUrl = urlParams.get("detail");

        if (restaurantUrl) {
            this.restaurantService.getRestaurantData(restaurantUrl).subscribe({
                next: (res: any) => {
                    if (res && res.data) {
                        this.currentRestaurantData = res.data;
                        this.checkForTables();
                    }
                },
                error: (err) => {
                    console.error("Error loading restaurant data:", err);
                    this.showCallWaiterButton = false;
                },
            });
        }
    }

    checkForTables() {
        if (this.currentRestaurantData && this.currentRestaurantData._id) {
            // Get tables for the restaurant
            this.restaurantService
                .checkActiveDineIn(this.currentRestaurantData._id)
                .subscribe({
                    next: (res: any) => {
                        console.log("Tables response:", res);
                        if (
                            res &&
                            res.data &&
                            res.data.tables &&
                            res.data.tables.tables
                        ) {
                            this.tableData = res.data.tables.tables.filter(
                                (table) => table.isAvailable
                            );
                            // Only show Call Waiter button if there are available tables
                            this.showCallWaiterButton =
                                this.tableData.length > 0;
                            console.log(
                                "Call Waiter button visible:",
                                this.showCallWaiterButton
                            );
                            console.log("Available tables:", this.tableData);
                        } else {
                            this.showCallWaiterButton = false;
                            console.log("No tables available");
                        }
                    },
                    error: (err) => {
                        console.error("Error loading tables:", err);
                        this.showCallWaiterButton = false;
                    },
                });
        }
    }

    openCallWaiterDialog() {
        if (!this.currentRestaurantData || this.tableData.length === 0) {
            console.log("No tables available for calling a waiter");
            return;
        }

        const dialogRef = this.dialog.open(CallWaiterDialogComponent, {
            width: "400px",
            panelClass: "call-waiter-dialog",
            disableClose: false,
            data: {
                restaurantData: this.currentRestaurantData,
                tableData: this.tableData,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.success) {
                console.log("Waiter call was successful");
                // Refresh the table data
                this.checkForTables();
            }
        });
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
