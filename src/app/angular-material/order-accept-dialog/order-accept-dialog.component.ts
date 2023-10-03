import { Component, Inject, OnInit } from "@angular/core";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { AcceptDialogComponent } from "src/app/admin/layout/order-dialog/accept-dialog/accept-dialog.component";
import { CancelDialogComponent } from "src/app/admin/layout/order-dialog/cancel-dialog/cancel-dialog.component";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { OrderService } from "src/app/api/order.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-order-accept-dialog",
    templateUrl: "./order-accept-dialog.component.html",
    styleUrls: ["./order-accept-dialog.component.scss"],
})
export class OrderAcceptDialogComponent implements OnInit {
    rows = [];
    columns = [];
    ColumnMode = ColumnMode;
    orderAmount = 0;
    deliveryAmount = 0;
    gstAmount = 0;
    discountAmount = 0;
    constructor(
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public orderData: any,
        private dialogRef: MatDialogRef<OrderAcceptDialogComponent>,
        private orderService: OrderService,
        private restaurantPanelService:RestaurantPanelService
    ) {}

    ngOnInit(): void {
        console.log(this.orderData);
        this.getOrderTotal();
    }
    getChoicesList(choicesData) {
        let str = "";
        for (const data of choicesData) {
            for (const choice of data.choicesSelected) {
                str += `${choice.choiceName} ,`;
            }
        }
        return str;
    }
    getExtrasList(extraData) {
        let str = "";
        for (const data of extraData) {
            for (const addon of data.addOnsSelected) {
                str += `${addon.addOnName} ,`;
            }
        }
        return str;
    }
    openCancelOrderDialog() {
        let dialogRef = this.dialog
            .open(CancelDialogComponent, {
                disableClose: true,
                panelClass: "app-full-bleed-dialog",
                data: this.orderData,
            })
            .afterClosed()
            .subscribe((res) => {
                
                if (res && res.successFlag) {
                    this.restaurantPanelService.playDashboardActionSound()
                    this.dialogRef.close({ successFlag: true });
                }
            });
    }
    openAcceptDialog() {
        let dialogRef = this.dialog
            .open(AcceptDialogComponent, {
                disableClose: true,
                panelClass: "add-item-dialog",
                data: this.orderData,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    this.restaurantPanelService.playDashboardActionSound()
                    this.dialogRef.close({ successFlag: true });
                }
            });
    }
    completeOrder() {
        const dialogData = {
            title: "Confirm",
            message:
                "Please confirm if you wish to proceed and complete this order.",
        };
        this.dialog
            .open(ConfirmDialogComponent, { data: dialogData })
            .afterClosed()
            .subscribe({
                next: (res: any) => {
                    console.log(res);

                    if (res && res.okFlag) {
                        this.orderService
                            .changeOrderStatus({
                                orderStatus: "completed",
                                orderId: this.orderData._id,
                            })
                            .subscribe({
                                next: () => {
                                    this.restaurantPanelService.playDashboardActionSound()
                                    this.dialogRef.close({ successFlag: true });
                                },
                            });
                    }
                },
            });
    }
    getOrderTotal() {
        this.orderAmount = 0;
        this.deliveryAmount = 0;
        this.gstAmount = 0;
        this.discountAmount = 0;
        for (const orderDetail of this.orderData.orderDetails) {
            this.orderAmount += orderDetail.orderAmount;
            this.deliveryAmount += orderDetail.deliveryAmount;
            this.gstAmount += orderDetail.gstAmount;
            this.discountAmount += orderDetail.discountAmount
                ? orderDetail.discountAmount
                : 0;
        }
    }
}
