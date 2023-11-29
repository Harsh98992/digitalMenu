import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OrderAcceptDialogComponent } from "src/app/angular-material/order-accept-dialog/order-accept-dialog.component";
import { OrderService } from "src/app/api/order.service";
import { RestaurantContactPopupComponent } from "../restaurant-menu/restaurant-contact-popup/restaurant-contact-popup.component";

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
            key: "completed",
            value: "Completed",
        },
        {
            key: "progress",
            value: "On Progress",
        },
        {
            key: "canceled",
            value: "Canceled",
        },
    ];
    constructor(
        private orderService: OrderService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getCustomerOrders();
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
    generateBill(id: string, orderId: string) {
        this.orderService.generateBill(id).subscribe({
            next: (res: any) => {
                if (res && res.data?.invoiceData?.pdf)
                    this.orderService.downloadBill(
                        res.data?.invoiceData?.pdf,
                        orderId
                    );
            },
        });
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
                data.orderStatus === "pending"
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
        };
        this.dialog.open(OrderAcceptDialogComponent, {
            minWidth: "90vw",
            data: dialogData,
        });
    }
}
