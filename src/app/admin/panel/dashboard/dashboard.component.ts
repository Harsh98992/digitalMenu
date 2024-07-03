import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrderService } from "src/app/api/order.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { OrderAcceptDialogComponent } from "../../../angular-material/order-accept-dialog/order-accept-dialog.component";
import { MatDialog } from "@angular/material/dialog";

import { environment } from "src/environments/environment";
const _ = require("lodash");
// Import the socket.io-client library
import { io } from "socket.io-client"; // Import the socket.io-client library
import { finalize } from "rxjs";
import { DatePipe } from "@angular/common";
import { UtilService } from "src/app/api/util.service";
import { CancelDialogComponent } from "../../layout/order-dialog/cancel-dialog/cancel-dialog.component";
import { AcceptDialogComponent } from "../../layout/order-dialog/accept-dialog/accept-dialog.component";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { PaymentDetailDialogComponent } from "src/app/angular-material/payment-detail-dialog/payment-detail-dialog.component";
import { PrintSpecificKotDialogComponent } from "src/app/angular-material/print-specific-kot-dialog/print-specific-kot-dialog.component";
import { PrintService, UsbDriver, WebPrintDriver } from "ng-thermal-print";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
    status: boolean = false;
    usbPrintDriver: UsbDriver;
    webPrintDriver: WebPrintDriver;
    ip: string = "";
    pendingOrder = [];
    processingOrder = [];
    activeDine = [];
    pendingPayment = [];
    private socket: any;
    apiUrl = environment.apiUrl;
    socketUrl = environment.socketApiUrl;
    restaurantId: any;

    allOrders = [];
    activeTab = "tab1";
    apiCalledFlag: boolean;
    takeAwayOptions = ["take away", "grab and go", "schedule dining"];
    bypassOptions = ["room service", "grab and go", "dining"];

    constructor(
        private restaurantService: RestaurantPanelService,
        private orderService: OrderService,
        private modalService: NgbModal,
        public dialog: MatDialog,
        private datePipe: DatePipe,

        private utilityService: UtilService,
        private printService: PrintService
    ) {
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
    }
    handleOrderUpdate(updatedOrder: any) {
        const index = this.allOrders.findIndex(
            (order) => order._id === updatedOrder._id
        );

        console.log("index", index);

        console.log("updatedOrder", updatedOrder);

        if (index !== -1) {
            this.allOrders[index] = updatedOrder;
        } else {
            this.allOrders.push(updatedOrder);
        }

        this.setOrder(this.allOrders);
    }

    restaurantDetail: any;

    totalBillForDineIn(details) {
        let total = 0;
        for (const order of details.orderDetails) {
            total += order.orderAmount + order.gstAmount + order.deliveryAmount;
        }
        return total;
    }
    ngOnInit(): void {
        this.getOrders();
        this.socket = io(this.socketUrl, {});
        console.log(this.socket);

        this.socket.on("connect", () => {
            console.log("connected");

            this.restaurantService.getRestaurnatDetail().subscribe({
                next: (res: any) => {
                    if (res && res.data && res.data.restaurantDetail) {
                        this.restaurantId = res.data.restaurantDetail._id;
                        this.restaurantDetail = res.data.restaurantDetail;
                    }

                    console.log("restaurantId", this.restaurantId);
                    this.socket.emit("joinRestaurantRoom", this.restaurantId); // Join the restaurant's room

                    console.log("called joinRestaurantRoom", this.restaurantId);
                },
            });
            this.socket.on("orderUpdate", (updatedOrder: any) => {
                console.log("called orderUpdate", updatedOrder);

                // this.handleOrderUpdate(updatedOrder);
                this.getOrders();
            });
        });
    }
    selectTab(tab: string) {
        this.activeTab = tab;
    }
    toggleLoyalStatus(row) {
        const customerId = row.customerId; // Replace with the actual property holding customer ID

        const isLoyal = !row?.loyalFlag;

        // Call the API to toggle loyal status
        this.restaurantService
            .toggleLoyalOrBlockStatus("loyal", customerId, isLoyal)
            .subscribe({
                next: (res: any) => {
                    this.ngOnInit();
                },
            });
    }
    openDialog(orderDetail: any) {
        this.dialog
            .open(OrderAcceptDialogComponent, {
                minWidth: "90vw",
                data: orderDetail,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    console.log("called api");

                    this.getOrders();
                }
            });
    }
    getChoicesList(choicesData) {
        let str = "";
        for (const data of choicesData) {
            for (const choice of data.choicesSelected) {
                str += `${choice.choiceName} ,`;
            }
        }
        return str.slice(0, -1);
    }
    getExtrasList(extraData) {
        let str = "";
        for (const data of extraData) {
            for (const addon of data.addOnsSelected) {
                str += `${addon.addOnName} ,`;
            }
        }
        return str.slice(0, -1);
    }
    openKOTPrintDialg(detail) {
        this.dialog
            .open(PrintSpecificKotDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: detail,
            })
            .afterClosed()
            .subscribe((resp) => {
                if (resp) {
                    console.log(resp);
                    this.printKTO(resp);
                }
            });
    }
    openCancelOrderDialog(orderDetail) {
        let dialogRef = this.dialog
            .open(CancelDialogComponent, {
                disableClose: true,
                panelClass: "app-full-bleed-dialog",
                data: orderDetail,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    this.restaurantService.playDashboardActionSound();
                    this.getOrders();
                }
            });
    }
    openAcceptDialog(orderDetail) {
        let dialogRef = this.dialog
            .open(AcceptDialogComponent, {
                disableClose: true,
                panelClass: "add-item-dialog",
                data: orderDetail,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    this.restaurantService.playDashboardActionSound();
                    this.getOrders();
                    if (res?.printKOT) {
                        this.printKTO(orderDetail);
                    }
                }
            });
    }
    openPaymentDetailDialog(orderDetail) {
        let dialogRef = this.dialog.open(PaymentDetailDialogComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
            data: orderDetail,
        });
    }
    completeOrder(orderDetail) {
        const dialogData = {
            title: "Confirm",
            message:
                "Please confirm if you wish to proceed and complete this order.",
            printBill: true,
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
                                orderId: orderDetail._id,
                            })
                            .subscribe({
                                next: () => {
                                    this.restaurantService.playDashboardActionSound();
                                    this.getOrders();
                                    if (res?.printBill) {
                                        this.printReceipt(orderDetail);
                                    }
                                },
                            });
                    }
                },
            });
    }
    getOrders() {
        const reqData = {
            orderStatus: ["pending", "processing", "pendingPayment"],
        };
        this.orderService
            .getRestaurantOrdersByStatus(reqData)
            .pipe(
                finalize(() => {
                    this.apiCalledFlag = true;
                })
            )
            .subscribe({
                next: (res: any) => {
                    if (res && res?.data && res.data && res.data?.orderData) {
                        this.setOrder(res.data.orderData);

                        this.allOrders = res.data.orderData;
                    }
                },
            });
    }
    setOrder(orderData: any) {
        this.pendingOrder = [];
        this.processingOrder = [];
        this.activeDine = [];
        this.pendingPayment = [];
        for (const data of orderData) {
            if (data.orderStatus === "pending") {
                this.pendingOrder.push(data);
                console.log("pendingOrder", this.pendingOrder);
            } else if (
                data.orderStatus === "processing" &&
                data.customerPreferences.preference !== "Dine In"
            ) {
                this.processingOrder.push(data);
                console.log("processingOrder", this.processingOrder);
            } else if (
                data.orderStatus === "processing" &&
                data.customerPreferences.preference === "Dine In"
            ) {
                this.activeDine.push(data);
                console.log(this.activeDine);
            } else if (data.orderStatus === "pendingPayment") {
                this.pendingPayment.push(data);
            }
        }
        this.checkForSoundPause();
    }
    checkForSoundPause() {
        if (this.pendingOrder && this.pendingOrder.length) {
            // this.restaurantService.playSound(true);
        } else {
            this.restaurantService.playSound(false);
        }
    }

    ngOnDestroy() {
        this.socket.disconnect(); // Disconnect the socket when component is destroyed
    }

    getTotalDineIn(orderData) {
        let amount = 0;
        for (const order of orderData.orderDetails) {
            amount += order.orderAmount;
            amount += order.gstAmount;
            amount -= order.discountAmount;
        }
        return amount;
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
                            this.utilityService.printKTOHelper(orderData,this.restaurantDetail);
                        }
                    }, 2000);
                },
                (err) => {
                    this.utilityService.printKTOHelper(orderData,this.restaurantDetail);
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
