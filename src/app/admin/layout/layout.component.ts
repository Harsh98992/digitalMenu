import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/api/authentication.service";
import { OrderDialogComponent } from "./order-dialog/order-dialog.component";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { Subject, takeUntil } from "rxjs";
import { OrderService } from "src/app/api/order.service";
import { OrderRecievedDialogComponent } from "src/app/angular-material/order-recieved-dialog/order-recieved-dialog.component";
import { io } from "socket.io-client";
import { environment } from "src/environments/environment";
import { CustomerService } from "src/app/api/customer.service";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnDestroy {
    showSideBarFlag = true;
    verifiedAccountFlag = false;
    selectedStatus = "online";
    dineInStatus = "online";
    adminRouteFlag = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    userDetail: any;
    body = document.body;
    staffRoleFlag: boolean = true;
    isDineInAvailable: any;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService,
        private orderService: OrderService,
        private customerService: CustomerService
    ) {
        this.socket = io(this.socketApiUrl);
    }

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    ngOnInit(): void {
        this.restaurantService.setRestaurantData();
        this.getRestaurantDetail();
        // this.restaurantService.callStatusApi();

        this.socket.on("connect", () => {
            console.log("connected");

            this.restaurantService.getRestaurnatDetail().subscribe({
                next: (res: any) => {
                    if (res && res.data && res.data.restaurantDetail) {
                        this.restaurantId = res.data.restaurantDetail._id;
                    }
                    this.checkDineIn();
                    console.log("restaurantId", this.restaurantId);
                    this.socket.emit("joinRestaurantRoom", this.restaurantId); // Join the restaurant's room

                    console.log("called joinRestaurantRoom", this.restaurantId);
                },
            });
            this.socket.on("orderUpdate", (updatedOrder: any) => {
                console.log("called orderUpdate", updatedOrder);

                this.restaurantService.callStatusApi();
            });
        });
    }
    checkDineIn() {
        this.customerService.isDineInAvailable(this.restaurantId).subscribe({
            next: (res: any) => {
                this.isDineInAvailable = res.data.isDineInAvailable;
            },
        });
    }

    changeRestaurantStatus() {
        const reqData = {
            restaurantStatus: this.selectedStatus,
        };
        if (this.selectedStatus) {
            this.restaurantService.changeRestaurantStatus(reqData).subscribe({
                next: (res) => {
                    this.restaurantService.setRestaurantData();
                },
            });
        }
        console.log(this.selectedStatus);
    }
    changeDineInStatus() {
        const reqData = {
            isDineInAvailableRestaurant:
                this.dineInStatus?.toLowerCase() === "online" ? true : false,
        };
        if (this.dineInStatus) {
            this.restaurantService.changeDineInStatus(reqData).subscribe({
                next: (res) => {
                    this.restaurantService.setRestaurantData();
                },
            });
        }
    }
    restaurantId(arg0: string, restaurantId: any) {
        throw new Error("Method not implemented.");
    }
    handleOrderUpdate(updatedOrder: any) {
        throw new Error("Method not implemented.");
    }

    getRestaurantDetail() {
        this.userDetail = this.authService.getUserDetail();
        this.restaurantService.restaurantData
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    if (res.restaurantStatus) {
                        this.selectedStatus = res.restaurantStatus;
                    }

                    this.dineInStatus = res.isDineInAvailableRestaurant
                        ? "online"
                        : "offline";

                    if (res.restaurantVerified) {
                        this.restaurantService.callStatusApi();
                    }
                    if (this.userDetail.role === "admin") {
                        this.adminRouteFlag = true;
                    } else {
                        this.verifiedAccountFlag = res?.restaurantVerified
                            ? true
                            : false;
                        if (this.userDetail.role === "staff") {
                            this.staffRoleFlag = true;
                        } else {
                            this.staffRoleFlag = false;
                        }
                    }
                },
            });
    }
    callStatusApi() {}
    toggleSideBar() {
        this.showSideBarFlag = !this.showSideBarFlag;
    }
    hideSideBar() {
        this.showSideBarFlag = true;
    }
    openOrderDialog() {
        let dialogRef = this.dialog.open(OrderDialogComponent, {
            disableClose: true,
            panelClass: "app-full-order-dialog",
        });
    }
    navigateToOrder() {
        this.router.navigateByUrl("/admin/restaurant-orders/accept");
    }
    logout() {
        this.authService.removeToken();
        this.restaurantService.restaurantData.next({});
        this.router.navigateByUrl("/admin/login");
    }
    ngOnDestroy() {
        this.restaurantService.playSound(false);
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
