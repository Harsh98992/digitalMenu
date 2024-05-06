import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OrderAcceptDialogComponent } from "src/app/angular-material/order-accept-dialog/order-accept-dialog.component";
import { OrderService } from "src/app/api/order.service";
import { RestaurantContactPopupComponent } from "../restaurant-menu/restaurant-contact-popup/restaurant-contact-popup.component";
import { Observable, interval } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-my-order",
    templateUrl: "./my-order.component.html",
    styleUrls: ["./my-order.component.scss"],
})
export class MyOrderComponent implements OnInit {
    completedOrder = [];
    processingOrder = [];
    cancelledOrder = [];
    bannerImg = "../assets/img/detail_1.jpg";
    selectedTab = "";
    tabs = [
        {
            key: "progress",
            value: "On Progress",
        },
        {
            key: "completed",
            value: "Completed",
        },
        {
            key: "canceled",
            value: "Rejected",
        },
    ];
    private refreshInterval$ = new Observable<number>();

    constructor(
        private orderService: OrderService,
        private dialog: MatDialog,
        private utilService: UtilService
    ) {
        // Set up the auto-refresh interval (every 30 seconds)
        this.refreshInterval$ = interval(10000);
    }

    /**
     * Initializes the component and combines auto-refresh with the existing order retrieval logic.
     */
    ngOnInit(): void {
        // Combine auto-refresh with the existing order retrieval logic
        // this.refreshInterval$
        //     .pipe(
        //         startWith(0), // To trigger the first fetch immediately
        //         switchMap(() => this.orderService.getCustomerOrder())
        //     )
        //     .subscribe({
        //         next: (res: any) => {
        //             if (res && res?.data && res.data && res.data?.orderData) {
        //                 const orderData = res.data.orderData.sort((a, b) => {
        //                     const date1 = new Date(a["orderDate"]) as any;
        //                     const date2 = new Date(b["orderDate"]) as any;
        //                     return date2 - date1;
        //                 });

        //                 this.setOrder(orderData);
        //             }
        //         },
        //     });

        //don't use auto refresh for now
        this.getCustomerOrders();

        // Set the selected tab to the first tab
        this.selectedTab = this.tabs[0].key;
        
    }
    changeStatus(tab) {
        this.selectedTab = tab.key;
    }
    getCustomerOrders() {
        this.orderService.getCustomerOrder().subscribe({
            next: (res: any) => {
                if (res && res?.data && res.data && res.data?.orderData) {
                    const orderData = res.data.orderData.sort((a, b) => {
                        const date1 = new Date(a["orderDate"]) as any;
                        const date2 = new Date(b["orderDate"]) as any;
                        return date2 - date1;
                    });

                    this.setOrder(orderData);
                }
            },
        });
    }
    generateBill(orderDetails: any) {
        this.utilService.printReceipt(
            orderDetails,
            orderDetails?.restaurantData[0]
        );

    }

    openContactPopUp(restaurantData) {
        this.dialog.open(RestaurantContactPopupComponent, {
            panelClass: "add-item-dialog",
            disableClose: true,
            data: restaurantData[0],
        });
    }
    setOrder(orderData: any) {
        this.completedOrder = [];
        this.processingOrder = [];
        this.cancelledOrder = [];
        for (const data of orderData) {
            if (data.orderStatus === "completed") {
                this.completedOrder.push(data);
            } else if (
                data.orderStatus === "processing" ||
                data.orderStatus === "pending" ||
                data.orderStatus === "pendingPayment"
            ) {
                this.processingOrder.push(data);
            } else {
                this.cancelledOrder.push(data);
            }
        }
    }
    getImage(orderData) {
        return orderData.restaurantData[0].restaurantBackgroundImage
            ? orderData.restaurantData[0].restaurantBackgroundImage
            : this.bannerImg;
    }
    displayDetails(tab) {
        if (tab.key === "completed") {
            return this.completedOrder;
        } else if (tab.key === "progress") {
            return this.processingOrder;
        } else {
            return this.cancelledOrder;
        }
    }
    showOrderDetails(orderSummary: any) {
        const dialogData = {
            ...orderSummary,
            customerMode: true,
            completeScreen: true,
        };

        this.dialog.open(OrderAcceptDialogComponent, {
            minWidth: "90vw",
            data: dialogData,
        });
    }
}
