import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { io } from "socket.io-client";
import { OrderService } from "src/app/api/order.service";
import { UtilService } from "src/app/api/util.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";
import { environment } from "src/environments/environment";
declare var Razorpay: any;
@Component({
    selector: "app-payment-dialog",
    templateUrl: "./payment-dialog.component.html",
    styleUrls: ["./payment-dialog.component.scss"],
})
export class PaymentDialogComponent implements OnInit {
    paymentMethod: string;
    paymentOption = [{ key: "cashOnDelivery", value: "Cash On Delivery" }];

    // paymentOption = [{ key: "cashOnDelivery", value: "Cash On Delivery" }];

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    socketOrderPlacedEvent = "orderPlaced";
    transferDetails: any;
    validatedData: any;
    storeFlag: boolean;

    socketOrderPlaced(data: any) {
        this.socket.emit(this.socketOrderPlacedEvent, data);
    }

    razorPayOptions = {
        key: "",
        amount: "",
        currency: "INR",
        name: "",

        description: "",
        order_id: "",
        // redirect: true,
        // callback_url: 'https://qrsay.com/contact',
        handler: function (response) {
            // Control comes here only in case of success. In case of failure,  razorpay form shows "Retry button"
            console.log("Payment Success");
            // Your custom logic
        },
    };

    razorPayData: any;
    totalAmount: number = 0;

    constructor(
        public restaurantService: RestaurantService,
        public orderService: OrderService,
        @Inject(MAT_DIALOG_DATA) public orderData: any,
        public dialogRef: MatDialogRef<PaymentDialogComponent>,
        public router: Router,
        private utilService: UtilService
    ) {
        this.socket = io(this.socketApiUrl);
    }

    ngOnInit(): void {
        console.log(this.orderData);

        this.getOrderTotal();
        this.checkForCashOnDelivery();
        if (this.orderData?.paymentOnlineAvailable) {
            this.paymentOption.unshift({
                key: "payOnline",
                value: "Pay Online",
            });
            if (
                this.orderData?.orderDetails[0]?.customerPreferences?.preference?.toLowerCase() ===
                    "room service" ||
                this.orderData?.orderDetails[0]?.customerPreferences?.preference?.toLowerCase() ===
                    "grab and go" ||
                this.orderData?.orderDetails[0]?.customerPreferences?.preference?.toLowerCase() ===
                    "dining"
            ) {
                this.paymentMethod = "payOnline";
                this.paymentOption = this.paymentOption.filter(
                    (x) => x.key === "payOnline"
                );
                this.completePayment();
            }
        }
    }
    checkForCashOnDelivery() {
        if (!this.orderData?.cashOnDeliveryAvailable) {
            this.paymentOption.pop();
        }
    }
    getOrderTotal() {
        this.totalAmount = 0;
        for (const orderDetail of this.orderData.orderDetails) {
            this.totalAmount += orderDetail.orderAmount;
            this.totalAmount += orderDetail.deliveryAmount;
            this.totalAmount += orderDetail.gstAmount;
        }
        console.log(this.totalAmount);
    }
    buyRazorPay() {
        this.razorPayData = {
            amount: this.totalAmount,
            restaurantId: this.orderData.restaurantId,
        };
        this.restaurantService.razorPay(this.razorPayData).subscribe((res) => {
            this.razorPayOptions.key = res["key"];
            this.razorPayOptions.amount = res["value"]["amount"];

            this.razorPayOptions.name = this.razorPayData["name"];
            this.razorPayOptions.description =
                this.orderData["restaurantName"] ?? "";
            this.razorPayOptions.order_id = res["value"]["id"];
            this.transferDetails = res["value"]["transfers"]?.length
                ? res["value"]["transfers"][0]
                : "";
            // this.razorPayOptions.transfer_id = res["value"]["transfers"]?.length ? res["value"]["transfers"][0]?['id'] : ''

            this.razorPayOptions.handler = this.razorPayResponseHandler;

            this.placeOrderTemp();
        });
    }
    placeOrderTemp() {
        let reqData = this.validatedData[0];

        if (this.paymentMethod === "payOnline") {
            reqData = {
                ...reqData,
                paymentMethod: "payOnline",
                razorpay_order_id: this.razorPayOptions.order_id,

                razorpay_tranferData: this.transferDetails,
            };
        } else if (this.paymentMethod === "cashOnDelivery") {
            reqData = {
                ...reqData,
                paymentMethod: "cashOnDelivery",
            };
        }
        reqData["storeFlag"] = true;
        this.storeFlag = true;
        this.orderService.placeOrder(reqData).subscribe({
            next: (res: any) => {
                if (res["status"] == "success") {
                    var rzp1 = new Razorpay(this.razorPayOptions);
                    rzp1.open();
                }
            },
        });
    }

    razorPayResponseHandler(response) {
        var event = new CustomEvent("payment.success", {
            detail: response,
            bubbles: true,
            cancelable: true,
        });
        window.dispatchEvent(event);
    }
    @HostListener("window:payment.success", ["$event"])
    onPaymentSuccess(event): void {
        console.log(event);

        if (event.detail) {
            // this.dialogRef.close({
            //     method: "payOnline",
            //     event,
            //     transferDetails: this.transferDetails,
            // });
            if (this.storeFlag) {
                this.dialogRef.close({
                    method: "payOnlineWithStore",
                    event,
                    transferDetails: this.transferDetails,
                });
            } else {
                this.dialogRef.close({
                    method: "payOnline",
                    event,
                    transferDetails: this.transferDetails,
                });
            }

            // this.orderService
            //     .changeOrderStatusByUser({
            //         orderId: this.orderData._id,
            //         restaurantId: this.orderData.restaurantId,
            //         orderStatus: "processing",
            //         razorpay_order_id: event.detail["razorpay_order_id"],
            //         razorpay_payment_id: event.detail["razorpay_payment_id"],
            //         razorpay_signature: event.detail["razorpay_signature"],
            //     })
            //     .subscribe({
            //         next: (res) => {
            //             this.socketOrderPlaced(this.orderData);
            //             this.router.navigateByUrl("/orders");
            //             this.dialogRef.close();
            //         },
            //     });
        }
    }

    completePayment() {
        if (!this.paymentMethod) {
            this.utilService.openSnackBar("Please choose payment method", true);
            return;
        }
        let bodyData: any = [
            {
                orderSummary:
                    this.orderData?.["orderDetails"][0]?.["orderSummary"] ?? "",
                customerPreferences:
                    this.orderData?.["orderDetails"][0]?.[
                        "customerPreferences"
                    ] ?? "",

                orderAmount:
                    this.orderData?.["orderDetails"][0]?.["orderAmount"] ?? "",
                restaurantId: this.orderData?.["restaurantId"] ?? "",
                gstAmount:
                    this.orderData?.["orderDetails"][0]?.["gstAmount"] ?? "",
                discountAmount:
                    this.orderData?.["orderDetails"][0]?.["discountAmount"] ??
                    "",
                deliveryAmount:
                    this.orderData?.["orderDetails"][0]?.["deliveryAmount"] ??
                    "",
            },
        ];
        this.validatedData = bodyData;
        if (this.paymentMethod === "cashOnDelivery") {
            this.restaurantService
                .validationBeforeOrder(bodyData[0])
                .subscribe((res) => {
                    if (this.paymentMethod === "cashOnDelivery") {
                        this.dialogRef.close({
                            method: "cashOnDelivery",
                            event,
                        });
                        // this.orderService
                        //     .changeOrderStatusByUserForCashOnDelivery({
                        //         orderId: this.orderData._id,
                        //         restaurantId: this.orderData.restaurantId,
                        //         orderStatus: "processing",
                        //     })
                        //     .subscribe({
                        //         next: (res) => {
                        //             this.socketOrderPlaced(this.orderData);
                        //             this.router.navigateByUrl("/orders");
                        //             this.dialogRef.close();
                        //         },
                        //     });
                    } else {
                    }
                });
        } else {
            this.buyRazorPay();
        }
    }
}
