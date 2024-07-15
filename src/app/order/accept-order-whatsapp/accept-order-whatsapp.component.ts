import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { io } from "socket.io-client";
import { AcceptDialogComponent } from "src/app/admin/layout/order-dialog/accept-dialog/accept-dialog.component";
import { CancelDialogComponent } from "src/app/admin/layout/order-dialog/cancel-dialog/cancel-dialog.component";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { OrderService } from "src/app/api/order.service";
import { UtilService } from "src/app/api/util.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-accept-order-whatsapp",
    templateUrl: "./accept-order-whatsapp.component.html",
    styleUrls: ["./accept-order-whatsapp.component.scss"],
})
export class AcceptOrderWhatsappComponent implements OnInit {
    printWindow: any;
    orderData: any;
    socketApiUrl = environment.socketApiUrl;
    socket: any;
    orderStatus = null;
    buttonText = "";
    buttonDisabled: boolean;
    restaurantData: any;
    orderId: any;
    constructor(
        private route: ActivatedRoute,
        private restaurantService: RestaurantService,
        private utilService: UtilService,
        private orderService: OrderService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.socket = io(this.socketApiUrl);
        this.getOrderId();
    }
    getOrderId() {
        this.route.params.subscribe((params: any) => {
            this.orderId=params.orderId;
            this.getOrderDataFromServer();
        });
    }
    getOrderDataFromServer() {
        const orderId = this.orderId;
        if (orderId) {
            this.restaurantService.getOrderwithOrderId(orderId).subscribe({
                next: (res) => {
                    if (res && res["data"]?.["orderData"]?._id) {
                        this.orderData = res["data"]["orderData"];
                        this.setButtonText();
                        this.restaurantService
                            .getRestaurantById(
                                res["data"]?.["orderData"]?.restaurantId
                            )
                            .subscribe({
                                next: (res) => {
                                    this.restaurantData =
                                        res["data"]["restaurant"];
                                    const output =
                                        this.utilService.printReceipt(
                                            this.orderData,
                                            this.restaurantData,
                                            true
                                        ) as any;
                                    this.printWindow =
                                        output.split("<body>")[1];
                                    console.log(this.printWindow);
                                },
                            });
                        // const orderSummary = res["data"]["orderData"];
                        // this.utilService.printReceipt(orderSummary);
                    } else {
                    }
                },
            });
        }
    }
    setButtonText() {
        const orderStatus = this.orderData.orderStatus;
        this.orderStatus = orderStatus;
        if (orderStatus.toLowerCase() === "processing") {
            this.buttonText = "Complete Order";
        } else if (orderStatus.toLowerCase() === "pending") {
            this.buttonText = "Accept Order";
        }
         else {
            this.buttonText = "Complete";
            this.buttonDisabled = true;
        }
    }
    acceptOrder() {
        if (this.orderStatus.toLowerCase() === "pending") {
            const reqData = {
                orderStatus: "accepted",
                preprationTime: "00:40",
                paymentOnlineAvailable: true,
                cashOnDeliveryAvailable: true,
                orderId: this.orderData._id,
            };
            this.orderService.changeOrderStatus(reqData).subscribe({
                next: (res) => {
                    this.getOrderDataFromServer()
                    this.socket.emit("orderAcceptedOrRejected", this.orderData);
                },
            });
        } else if (this.orderStatus.toLowerCase() === "processing") {
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
                                    orderId: this.orderData._id,
                                })
                                .subscribe({
                                    next: () => {
                                        this.getOrderDataFromServer()
                                        if (res?.printBill) {
                                            // this.utilService.printReceipt(
                                            //     this.orderData,
                                            //     this.restaurantData,
                                            //     false
                                            // );
                                        }
                                    },
                                });
                        }
                    },
                });
        }
    }
    openCancelOrderDialog() {
       const orderDetail=this.orderData
        let dialogRef = this.dialog
            .open(CancelDialogComponent, {
                disableClose: true,
                panelClass: "app-full-bleed-dialog",
                data: orderDetail,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    this.getOrderDataFromServer();
                }
            });
    }
}
