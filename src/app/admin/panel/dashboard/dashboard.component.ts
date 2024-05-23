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

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
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
    constructor(
        private restaurantService: RestaurantPanelService,
        private orderService: OrderService,
        private modalService: NgbModal,
        public dialog: MatDialog,
        private datePipe: DatePipe,

        private utilityService: UtilService
    ) {}
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
        let orderTypeStr = "";
        const orderDetail = _.cloneDeep(orderData);
        if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "room service"
        ) {
            orderTypeStr =
                "Room Number :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "delivery"
        ) {
            orderTypeStr =
                "Address :- " + orderDetail.customerPreferences.value.address;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "dine in"
        ) {
            orderTypeStr =
                "Dine In :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "take away"
        ) {
            orderTypeStr =
                "Take Away :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "schedule dining"
        ) {
            orderTypeStr =
                "Schedule Dining :- " + orderDetail.customerPreferences.value;
        }
        if (
            orderDetail?.customerPreferences?.preference?.toLowerCase() ===
            "dine in"
        ) {
            for (const [index, order] of orderData.orderDetails.entries()) {
                if (index > 0) {
                    orderDetail.orderDetails[0]["orderSummary"].push(
                        ...order["orderSummary"]
                    );
                    orderDetail.orderDetails[0]["orderAmount"] +=
                        order["orderAmount"];
                    orderDetail.orderDetails[0]["gstAmount"] +=
                        order["gstAmount"];
                    orderDetail.orderDetails[0]["deliveryAmount"] +=
                        order["deliveryAmount"];
                    orderDetail.orderDetails[0]["discountAmount"] +=
                        order["discountAmount"];
                }
            }
        }
        // Please convert the above style of the bill code into the typescript code for making the print content of the bill on the print window

        const printWindow = window.open("", "", "width=2in");

        printWindow.document.write("<html><head><title>bill</title>");

        // stylesheets

        printWindow.document.write(
            `   <style>
            .receipt {
                width: 300px;
                margin: 0 auto;
                height: 30px;
                font-weight: 600;
                padding: 5px;
                font-family: Arial, sans-serif;
                font-size: 15px;
            }

            .header {
                text-align: center;
            }

            .header img {
                width: 80px;
                height: 80px;
            }

            .header h1 {
                font-size: 20px;
                margin: 0;
            }

            .header p {
                margin: 2px 0;
            }

            .item-table {
                width: 100%;
                border-collapse: collapse;
                margin: 5px 0;
            }

            .item-table th,
            .item-table td {
                border: 1px solid black;
                padding: 2px;
            }

            .item-table th {
                text-align: left;
            }

            .item-table td {
                text-align: left;
            }

            .footer {
                display: flex;
                justify-content: space-between;
                margin: 0px 0;
            }

            .footer p {
                margin: 0;
            }

            .total {
                font-weight: bold;
            }
            .captalize {
                text-transform: capitalize;
            }
            .font-bold {
                font-weight: bold;
            }
            .right {
                text-align: right;
            }
            .center {
                text-align: center !important;
            }
            .space-between {
                display: flex;
                justify-content: space-between;
            }
            .border-none {
                font-size: 14px;
                font-weight: 600;
                border-left: 0 !important;
                border-right: 0 !important;
                border-bottom: 0 !important;
                border-top: 0 !important;
            }
            .dash-line {
                border-top: 2px dashed grey;
                width: 100%;
                margin-top: 0px;
                margin-bottom: 0.1px;
            }
            span {
                font-size: 14px;
            }

            .border-main-none {
                font-size: 14px;
                border-left: 0 !important;
                border-right: 0 !important;
                border-top: 2px dashed grey;
                border-bottom: 2px dashed grey;
            }
            .margin-custom {
                margin-right: 1.3rem !important;
            }
        </style>`
        );
        printWindow.document.write("</head><body>");

        printWindow.document.write(
            `<div class="receipt">
            <div class="header">

                <h1>${this.restaurantDetail.restaurantName.toUpperCase()}</h1>

            </div>
            <p style="text-align:center;margin-bottom:0px" class="captalize font-bold">${
                orderDetail.customerPreferences.preference
            }</p>
            <div  style="text-align:center">${orderTypeStr}</div>
            <p>
            <span class="space-between">
            ${this.datePipe.transform(orderDetail.orderDate)}
         <span>   ${new Date(orderDetail.orderDate).toLocaleTimeString()}</span>
            </span>

            Order ID: ${orderDetail.orderId}<br>

            ${orderDetail.customerName}<br>
            ${orderDetail.customerEmail}<br>
            <span style="word-break:break-all">
            Cooking Instructions: ${
                orderDetail?.orderDetails?.[0].cookingInstruction ?? ""
            }<br>
            </span>
           </p>

            <table class="item-table ">
                <tr  class="border-main-none">
                    <th  class="border-main-none">Items</th>

                    <th  class="border-main-none center">Qty</th>
                </tr>`
        );

        for (const order of orderDetail.orderDetails[0].orderSummary) {
            printWindow.document.write("<tr  class='border-none'>");
            printWindow.document.write(
                `<td class='border-none'>${order.dishName}`
            );

            var checkIfFirst = true;
            if (order.extraSelected && order.extraSelected.length) {
                for (const extra of order.extraSelected) {
                    if (checkIfFirst) {
                        printWindow.document.write(
                            `with ${extra.addOnDisplayName}(${extra.addOnsSelected[0].addOnName})`
                        );
                        checkIfFirst = false;
                    } else {
                        printWindow.document.write(
                            ` and ${extra.addOnDisplayName}(${extra.addOnsSelected[0].addOnName})`
                        );
                    }
                }
            }
            printWindow.document.write(
                `<td class='border-none center'>${order.dishQuantity}</td>`
            );
            printWindow.document.write("</tr>");
        }

        printWindow.document.write("</table>");
        printWindow.document.write("<div class='dash-line'></div>");

        printWindow.document.write(
            `<span>Total Quantity: ${orderDetail.orderDetails[0].orderSummary.length}</span>
                `
        );

        // if (orderDetail.orderDetails[0].gstAmount) {
        //     printWindow.document.write(
        //         `<div class="footer">
        //         <p>GST Amount</p>
        //         <p>${orderDetail.orderDetails[0].gstAmount}</p>
        //     </div>`
        //     );
        // }

        printWindow.document.write("</div>");
        printWindow.document.write("</body></html>");

        console.log("printWindow", printWindow.document);

        // printWindow.document.write(printContent);

        var ua = navigator.userAgent.toLowerCase();

        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

        if (isAndroid) {
            console.log("android");

            // downlaod the file in android device with 2 inch breadth
        } else {
            console.log("not android");

            printWindow.print();

            printWindow.close();
        }

        // printWindow.print();

        // printWindow.close();
    }
    printReceipt(orderDetail: any) {
        this.utilityService.printReceipt(orderDetail, this.restaurantDetail);
    }
}
