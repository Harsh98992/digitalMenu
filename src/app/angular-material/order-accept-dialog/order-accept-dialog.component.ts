import { Component, Inject, OnInit } from "@angular/core";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { PrintService, UsbDriver } from "ng-thermal-print";
import { AcceptDialogComponent } from "src/app/admin/layout/order-dialog/accept-dialog/accept-dialog.component";
import { CancelDialogComponent } from "src/app/admin/layout/order-dialog/cancel-dialog/cancel-dialog.component";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { OrderService } from "src/app/api/order.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";

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
    completeScreen = false;
    roomScreenFlag = false;
    usbPrintDriver: UsbDriver;
    status: boolean;
    restaurantDetail: any;
    customerMode: any;
    constructor(
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public orderData: any,
        private dialogRef: MatDialogRef<OrderAcceptDialogComponent>,
        private orderService: OrderService,
        private restaurantPanelService: RestaurantPanelService,
        private printService: PrintService,
        private utilityService: UtilService
    ) {}

    ngOnInit(): void {
        const device = JSON.parse(localStorage.getItem("printer-device"));
        if (device) {
            this.usbPrintDriver = new UsbDriver(
                device.vendorId,
                device.productId
            );
        } else {
            this.usbPrintDriver = new UsbDriver();
        }
        this.printService.setDriver(this.usbPrintDriver, "ESC/POS");
        this.printService.isConnected.subscribe((result) => {
            this.status = result;
            if (result) {
                console.log("Connected to printer!!!");
            } else {
                console.log("Not connected to printer.");
            }
        });
        this.customerMode=this.orderData?.customerMode ?? false;
        if (this.orderData?.completeScreen) {
            this.completeScreen = this.orderData.completeScreen;
            this.roomScreenFlag = this.orderData.roomScreenFlag;
        }
        if(!this.orderData?.customerMode){
            this.restaurantPanelService.getRestaurnatDetail().subscribe({
                next: (res: any) => {
                    if (res && res.data && res.data.restaurantDetail) {
                        this.restaurantDetail = res.data.restaurantDetail;
                    }
                },
            });
        }
       
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
                    this.restaurantPanelService.playDashboardActionSound();
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
                    this.restaurantPanelService.playDashboardActionSound();
                    this.dialogRef.close({
                        successFlag: true,
                        printKOT: res?.printKOT,
                    });
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
                                    this.restaurantPanelService.playDashboardActionSound();
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
    printKTO(orderData) {
        if (!this.status) {
            this.usbPrintDriver.requestUsb().subscribe(
                (result) => {
                    this.printService.setDriver(this.usbPrintDriver, "ESC/POS");
                    setTimeout(() => {
                        if (this.status) {
                            this.printEPOSRecieptHelper(
                                orderData,
                                this.restaurantDetail,
                                true
                            );
                        } else {
                            this.utilityService.printKTOHelper(
                                orderData,
                                this.restaurantDetail
                            );
                        }
                    }, 2000);
                },
                (err) => {
                    this.utilityService.printKTOHelper(
                        orderData,
                        this.restaurantDetail
                    );
                }
            );
        } else {
            this.printEPOSRecieptHelper(orderData, this.restaurantDetail, true);
        }
        // this.printKTOHelper(orderData);
        // const reqData = {
        //     orderDetail: orderData,
        //     restaurantDetail: this.restaurantDetail,
        //     kotFlag: true,
        // };
        // this.restaurantService.generateBill(reqData).subscribe({
        //     next: (res: any) => {
        //         if (res && res?.data?.state?.toLowerCase() == "fail") {
        //             this.printKTOHelper(orderData);
        //         }
        //     },
        // });
    }

    printEPOSRecieptHelper(orderDetail, restaurantDetail, flag = false) {
        this.utilityService.printEPOSReciept(
            orderDetail,
            restaurantDetail,
            flag
        );
    }
    printReceipt(orderDetail: any) {
        if (!this.status) {
            this.usbPrintDriver.requestUsb().subscribe(
                (result) => {
                    this.printService.setDriver(this.usbPrintDriver, "ESC/POS");

                    setTimeout(() => {
                        if (this.status) {
                            this.utilityService.setPrinterDriver(result);
                            this.printEPOSRecieptHelper(
                                orderDetail,
                                this.restaurantDetail
                            );
                        } else {
                            this.utilityService.printReceipt(
                                orderDetail,
                                this.restaurantDetail
                            );
                        }
                    }, 1000);
                },
                (err) => {
                    this.utilityService.printReceipt(
                        orderDetail,
                        this.restaurantDetail
                    );
                }
            );
        } else {
            this.printEPOSRecieptHelper(orderDetail, this.restaurantDetail);
        }

        // this.utilityService.printReceipt(
        //     orderDetail,
        //     this.restaurantDetail
        // );
        // const reqData = {
        //     orderDetail,
        //     restaurantDetail: this.restaurantDetail,
        //     kotFlag: false,
        // };
        // this.restaurantService.generateBill(reqData).subscribe({
        //     next: (res: any) => {
        //         if (res && res?.data?.state?.toLowerCase() == "fail") {

        //         }
        //     },
        // });
    }
}
