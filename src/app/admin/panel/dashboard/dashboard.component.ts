import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrderService } from "src/app/api/order.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { OrderAcceptDialogComponent } from "../../../angular-material/order-accept-dialog/order-accept-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { NgxPrintModule } from "ngx-print";
import { environment } from "src/environments/environment";

// Import the socket.io-client library
import { io } from "socket.io-client"; // Import the socket.io-client library
import { finalize } from "rxjs";
import { DatePipe } from "@angular/common";

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
    constructor(
        private restaurantService: RestaurantPanelService,
        private orderService: OrderService,
        private modalService: NgbModal,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private printService: NgxPrintModule
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
            } else if (
                data.orderStatus === "processing" &&
                data.customerPreferences.preference !== "Dine In"
            ) {
                this.processingOrder.push(data);
            } else if (
                data.orderStatus === "processing" &&
                data.customerPreferences.preference === "Dine In"
            ) {
                this.activeDine.push(data);
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

    // ngxPrint (click)="printReceipt(details)"

    // "Orderdetails": [
    //     {
    //         "orderAmount": 359,
    //         "gstAmount": 0,
    //         "deliveryAmount": 0,
    //         "discountAmount": 0,
    //         "cookingInstruction": "",
    //         "orderSummary": [
    //             {
    //                 "dishChoicesSelected": [],
    //                 "extraSelected": [
    //                     {
    //                         "elementId": "654648097fe0a384cc2fb6ab",
    //                         "addOnsSelected": [
    //                             {
    //                                 "addOnName": "small",
    //                                 "addOnPrice": 30,
    //                                 "category": "veg"
    //                             },
    //                             {
    //                                 "addOnName": "medium",
    //                                 "addOnPrice": 60,
    //                                 "category": "veg"
    //                             }
    //                         ],
    //                         "addOnDisplayName": "extra cheese"
    //                     },
    //                     {
    //                         "elementId": "654650d97fe0a384cc2fd1f9",
    //                         "addOnsSelected": [
    //                             {
    //                                 "addOnName": "Small",
    //                                 "addOnPrice": 30,
    //                                 "category": "veg"
    //                             },
    //                             {
    //                                 "addOnName": "Medium",
    //                                 "addOnPrice": 60,
    //                                 "category": "veg"
    //                             }
    //                         ],
    //                         "addOnDisplayName": "cheese burst"
    //                     },
    //                     {
    //                         "elementId": "654651197fe0a384cc2fd265",
    //                         "addOnsSelected": [
    //                             {
    //                                 "addOnName": "Small",
    //                                 "addOnPrice": 20,
    //                                 "category": "veg"
    //                             },
    //                             {
    //                                 "addOnName": "Medium",
    //                                 "addOnPrice": 40,
    //                                 "category": "veg"
    //                             },
    //                             {
    //                                 "addOnName": "Large",
    //                                 "addOnPrice": 50,
    //                                 "category": "veg"
    //                             }
    //                         ],
    //                         "addOnDisplayName": "extra toppings"
    //                     }
    //                 ],
    //                 "itemSizeSelected": null,
    //                 "dishQuantity": 1,
    //                 "priceOneItem": 359,
    //                 "totalPrice": 359,
    //                 "dishType": "veg",
    //                 "dishName": "Onion",
    //                 "dishId": "65798e148d584c8e8e77b8f7",
    //                 "dishPrice": 69
    //             }
    //         ],
    //         "_id": "65bf61112169ee4d3cc2dffb",
    //         "orderPlaceDateAndTime": "2024-02-04T10:04:01.540Z"
    //     }
    // ]

    //     <html>
    // <head>
    //   <style>
    //     /* Add your custom CSS styles here */
    //     .receipt {
    //       width: 300px;
    //       margin: 0 auto;
    //       border: 1px solid black;
    //       padding: 5px;
    //       font-family: Arial, sans-serif;
    //       font-size: 12px;
    //     }

    //     .header {
    //       text-align: center;
    //     }

    //     .header img {
    //       width: 80px;
    //       height: 80px;
    //     }

    //     .header h1 {
    //       font-size: 20px;
    //       margin: 0;
    //     }

    //     .header p {
    //       margin: 2px 0;
    //     }

    //     .item-table {
    //       width: 100%;
    //       border-collapse: collapse;
    //       margin: 5px 0;
    //     }

    //     .item-table th, .item-table td {
    //       border: 1px solid black;
    //       padding: 2px;
    //     }

    //     .item-table th {
    //       text-align: left;
    //     }

    //     .item-table td {
    //       text-align: right;
    //     }

    //     .footer {
    //       display: flex;
    //       justify-content: space-between;
    //       margin: 5px 0;
    //     }

    //     .footer p {
    //       margin: 0;
    //     }

    //     .total {
    //       font-weight: bold;
    //     }
    //   </style>
    // </head>
    // <body>
    //   <div class="receipt">
    //     <div class="header">
    //       <img src="logo.png" alt="Logo">
    //       <h1>THE LOCAL DINER</h1>
    //       <p>#2075, 4th Cross, 2nd Block,<br>
    //       HRBR Layout, Kalyan Nagar,<br>
    //       BANGALORE-560 043<br>
    //       PH: 080 41440087<br>
    //       TIN: 2908176093</p>
    //     </div>
    //     <p>CASH/BILL</p>
    //     <p>Bill No: A0615<br>
    //     Waiter: WAITER<br>
    //     TNo: D15<br>
    //     Date: 06/06/2015<br>
    //     Time: 20:54</p>
    //     <table class="item-table">
    //       <tr>
    //         <th>Items</th>
    //         <th>Price</th>
    //         <th>Qty</th>
    //         <th>Total Rs</th>
    //       </tr>
    //       <tr>
    //         <td>FLAVOURED MOJITO</td>
    //         <td>330.00</td>
    //         <td>1.000</td>
    //         <td>330.00</td>
    //       </tr>
    //       <tr>
    //         <td>CUCUMBER MINT</td>
    //         <td>170.00</td>
    //         <td>1.000</td>
    //         <td>170.00</td>
    //       </tr>
    //       <tr>
    //         <td>LONG ISLAND ICE TEA</td>
    //         <td>460.00</td>
    //         <td>1.000</td>
    //         <td>460.00</td>
    //       </tr>
    //       <tr>
    //         <td>CRUNCHY SALAD</td>
    //         <td>320.00</td>
    //         <td>1.000</td>
    //         <td>320.00</td>
    //       </tr>
    //       <tr>
    //         <td>ASSORTED SATAY</td>
    //         <td>260.00</td>
    //         <td>1.000</td>
    //         <td>260.00</td>
    //       </tr>
    //       <tr>
    //         <td>TEQUILA CHICKEN</td>
    //         <td>360.00</td>
    //         <td>1.000</td>
    //         <td>360.00</td>
    //       </tr>
    //       <tr>
    //         <td>FAJITAS CHICKEN</td>
    //         <td>300.00</td>
    //         <td>1.000</td>
    //         <td>300.00</td>
    //       </tr>
    //       <tr>
    //         <td>SURF N TURF</td>
    //         <td>380.00</td>
    //         <td>1.000</td>
    //         <td>380.00</td>
    //       </tr>
    //     </table>
    //     <p>Total Quantity: 9.000</p>
    //     <div class="footer">
    //       <p>Gross Total</p>
    //       <p>2560.00</p>
    //     </div>
    //     <div class="footer">
    //       <p>VAT 14.5%</p>
    //       <p>371.20</p>
    //     </div>
    //     <div class="footer">
    //       <p>Service Tax 5.8%</p>
    //       <p>148.48</p>
    //     </div>
    //     <div class="footer">
    //       <p>Net Amount</p>
    //       <p class="total">3079.68</p>
    //     </div>
    //     <div class="footer">
    //       <p>Service Charges 10.0%</p>
    //       <p>307.97</p>
    //     </div>
    //     <p>Get Back Joe Joe!</p>
    //   </div>
    // </body>
    // </html>

    printReceipt(orderDetail: any) {
        console.log("printReceipt", orderDetail);

        console.log(this.restaurantDetail);

        // const printContent = `
        // <p>${this.restaurantDetail.restaurantName}</p>
        // <p>Retail Invoice</p>
        // <p>Order Id: ${orderDetail.orderId}</p>
        // <p>Date: ${orderDetail.orderDate.split("T")[0]}</p>
        // <p>Name: ${orderDetail.customerName}</p>
        // <p>Phone no: ${orderDetail.customerPhoneNumber}</p>
        // <p>Payment Method: ${
        //     orderDetail.payment_method === undefined
        //         ? "Not done Yet"
        //         : orderDetail.payment_method
        // }</p>
        // `;
        // const printWindow = window.open("", "", "width=2in");
        // printWindow.document.write("<html><head><title>bill</title>");

        // // stylesheets
        // printWindow.document.write(
        //     `<style>

        //       table , th, td , tr , tbody , thead ,body,h1, h2, p, ul, li  {
        //         font-family: 'Courier New', monospace;
        //         font-size: 12px;
        //         padding: 0px;
        //         margin: 0px;

        //         }

        //       ul {
        //         list-style-type: none;
        //       }

        //       // table

        //       table {
        //         border-collapse: collapse;
        //       }

        //         th, td {
        //             padding: 0px;
        //         }

        //       </style>`
        // );
        // printWindow.document.write("</head><body>");

        // printWindow.document.write(printContent);
        // printWindow.document.write("<table>");
        // printWindow.document.write("<thead>");
        // printWindow.document.write("<tr>");
        // printWindow.document.write("<th>Item</th>");
        // printWindow.document.write("<th>Price</th>");
        // printWindow.document.write("<th>Qty</th>");
        // printWindow.document.write("<th>Total</th>");
        // printWindow.document.write("</tr>");
        // printWindow.document.write("</thead>");
        // printWindow.document.write("<tbody>");
        // for (const order of orderDetail.orderDetails[0].orderSummary) {
        //     printWindow.document.write("<tr>");
        //     printWindow.document.write(`<td>${order.dishName}</td>`);

        //     printWindow.document.write(`<td>${order.priceOneItem}</td>`);

        //     printWindow.document.write(`<td>${order.dishQuantity}</td>`);
        //     // printWindow.document.write(`<td>${order.priceOneItem*order.dishQuantity}</td>`);
        //     printWindow.document.write(`<td>${order.totalPrice}</td>`);
        //     printWindow.document.write("</tr>");

        //     // also add extra selected
        //     if (order.extraSelected && order.extraSelected.length) {

        //         var  checkIfFirst = true;

        //         for (const extra of order.extraSelected) {

        //             printWindow.document.write("<tr>");

        //             printWindow.document.write(
        //                 // `<td>${extra.addOnDisplayName}</td>`

        //                 // convert to title case
        //                 `<td>`);

        //             if (checkIfFirst) {
        //                 printWindow.document.write("addon-");
        //                 checkIfFirst = false;
        //             }

        //             printWindow.document.write(
        //                 `${extra.addOnDisplayName
        //                     .split(" ")
        //                     .map(
        //                         (s) =>
        //                             s.charAt(0).toUpperCase() + s.substring(1)
        //                     )
        //                     .join(" ")}</td>`
        //             );

        //             if (extra.addOnsSelected && extra.addOnsSelected.length) {
        //                 printWindow.document.write(
        //                     // `<td>${extra.addOnsSelected[0].addOnName}</td>`

        //                     // convert to title case
        //                     `<td>${extra.addOnsSelected[0].addOnName
        //                         .split(" ")
        //                         .map(
        //                             (s) =>
        //                                 s.charAt(0).toUpperCase() +
        //                                 s.substring(1)
        //                         )
        //                         .join(" ")}</td>`
        //                 );
        //             } else {
        //                 printWindow.document.write(`<td></td>`);
        //             }

        //             printWindow.document.write(
        //                 `<td>${order.dishQuantity}</td>`
        //             );
        //             printWindow.document.write(
        //                 // `<td>${extra.addOnsSelected[0].addOnPrice}</td>`
        //                 `<td></td>`
        //             );
        //             printWindow.document.write("</tr>");
        //         }
        //     }
        // }

        // // add total amount
        // printWindow.document.write("<tr>");
        // printWindow.document.write(`<td></td>`);
        // printWindow.document.write(`<td></td>`);
        // printWindow.document.write(`<td>Order Total</td>`);
        // printWindow.document.write(
        //     `<td>${orderDetail.orderDetails[0].orderAmount}</td>`
        // );
        // printWindow.document.write("</tr>");

        // printWindow.document.write("</tbody>");
        // printWindow.document.write("</table>");
        // printWindow.document.write("<br>");

        // if (orderDetail.gstAmount) {
        //     printWindow.document.write(
        //         `<p>GST Amount:${orderDetail.orderDetails[0].gstAmount}</p>`
        //     );
        // }
        // if (orderDetail.deliveryAmount) {
        //     printWindow.document.write(
        //         `<p>Delivery Amount:${orderDetail.orderDetails[0].deliveryAmount}</p>`
        //     );
        // }
        // if (orderDetail.discountAmount) {
        //     printWindow.document.write(
        //         `<p>Discount Amount:${orderDetail.orderDetails[0].discountAmount}</p>`
        //     );
        // }
        // printWindow.document.write(
        //     `<p>Total Amount Paid: ${orderDetail.orderDetails[0].orderAmount}</p>`
        // );
        // <html>

        // <head>
        //     <style>
        //         /* Add your custom CSS styles here */
        //         .receipt {
        //             width: 300px;
        //             margin: 0 auto;
        //             border: 1px solid black;
        //             padding: 5px;
        //             font-family: Arial, sans-serif;
        //             font-size: 12px;
        //         }

        //         .header {
        //             text-align: center;
        //         }

        //         .header h1 {
        //             font-size: 15px;
        //             margin: 0;
        //         }

        //         .header p {
        //             margin: 0;
        //             line-height: 1;
        //         }

        //         .item-table {
        //             width: 100%;
        //             border-collapse: collapse;
        //             margin: 5px 0;
        //         }

        //         .item-table th,
        //         .item-table td {
        //             border: 1px solid black;
        //             padding: 2px;
        //         }

        //         .item-table th {
        //             text-align: left;
        //         }

        //         .item-table td {
        //             text-align: right;
        //         }

        //         .footer {
        //             display: flex;
        //             justify-content: space-between;
        //             margin: 5px 0;
        //         }

        //         .footer p {
        //             margin: 0;
        //         }

        //         .total {
        //             font-weight: bold;
        //         }

        //         .top-table {
        //             width: 100%;
        //             border-collapse: collapse;
        //             margin: 0;
        //         }

        //         .top-table td {
        //             padding: 0;
        //         }

        //         .left {
        //             text-align: left;
        //         }

        //         .right {
        //             text-align: right;
        //         }
        //     </style>
        // </head>

        // <body>
        //     <div class="receipt">
        //         <div class="header">
        //             <h1>THE LOCAL DINER</h1>
        //             <p>#2075, 4th Cross, 2nd Block,<br>
        //                 HRBR Layout, Kalyan Nagar,<br>
        //                 BANGALORE-560 043<br>
        //                 PH: 080 41440087<br>
        //                 TIN: 2908176093</p>
        //         </div>
        //         <table class="top-table" border="1">
        //             <tr>
        //                 <th>CASH/BILL</th>
        //                 <th>Bill No:</th>
        //                 <th>Waiter:</th>
        //                 <th>TNo:</th>

        //             </tr>
        //             <tr>
        //                 <td>CASH/BILL</td>
        //                 <td>A0615</td>
        //                 <td>WAITER</td>
        //                 <td>D15</td>

        //             </tr>
        //             <tr>
        //                 <th>Date:</th>
        //                 <th>Time:</th>
        //             </tr>
        //             <tr>
        //                 <td>06/06/2015</td>
        //                 <td>20:54</td>
        //         </table>

        //         <table class="item-table">
        //             <tr>
        //                 <th>Items</th>
        //                 <th>Price</th>
        //                 <th>Qty</th>
        //                 <th>Total Rs</th>
        //             </tr>
        //             <tr>
        //                 <td>FLAVOURED MOJITO</td>
        //                 <td>330.00</td>
        //                 <td>1.000</td>
        //                 <td>330.00</td>
        //             </tr>
        //             <tr>
        //                 <td>CUCUMBER MINTCUCUMBER MINTCUCUMBER MINTCUCUMBER MINTCUCUMBER MINT</td>
        //                 <td>170.00</td>
        //                 <td>1.000</td>
        //                 <td>170.00</td>
        //             </tr>
        //             <tr>
        //                 <td>LONG ISLAND ICE TEA</td>
        //                 <td>460.00</td>
        //                 <td>1.000</td>
        //                 <td>460.00</td>
        //             </tr>
        //             <tr>
        //                 <td>CRUNCHY SALAD</td>
        //                 <td>320.00</td>
        //                 <td>1.000</td>
        //                 <td>320.00</td>
        //             </tr>
        //             <tr>
        //                 <td>ASSORTED SATAY</td>
        //                 <td>260.00</td>
        //                 <td>1.000</td>
        //                 <td>260.00</td>
        //             </tr>
        //             <tr>
        //                 <td>TEQUILA CHICKEN</td>
        //                 <td>360.00</td>
        //                 <td>1.000</td>
        //                 <td>360.00</td>
        //             </tr>
        //             <tr>
        //                 <td>FAJITAS CHICKEN</td>
        //                 <td>300.00</td>
        //                 <td>1.000</td>
        //                 <td>300.00</td>
        //             </tr>
        //             <tr>
        //                 <td>SURF N TURF</td>
        //                 <td>380.00</td>
        //                 <td>1.000</td>
        //                 <td>380.00</td>
        //             </tr>
        //         </table>
        //         <p>Total Quantity: 9.000</p>
        //         <div class="footer">
        //             <p>Gross Total</p>
        //             <p>2560.00</p>
        //         </div>
        //         <div class="footer">
        //             <p>GST 18%</p>
        //             <p>371.20</p>
        //         </div>

        //         <div class="footer">
        //             <p>Net Amount</p>
        //             <p class="total">3079.68</p>
        //         </div>

        //     </div>
        // </body>

        // </html>

        // Please convert the above style of the bill code into the typescript code for making the print content of the bill on the print window

        const printWindow = window.open("", "", "width=2in");

        printWindow.document.write("<html><head><title>bill</title>");

        // stylesheets

        printWindow.document.write(
            ` <style>
            .receipt {
                width: 300px;
                margin: 0 auto;
                border: 1px solid black;
                padding: 5px;
                font-family: Arial, sans-serif;
                font-size: 12px;
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
                font-size: 12px;
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
            span{
                font-size: 12px;
            }

            .border-main-none {
                font-size: 12px;
                border-left: 0 !important;
                border-right: 0 !important;
                border-top: 2px dashed grey;
                border-bottom: 2px dashed grey;
            }
        </style>`
        );
        printWindow.document.write("</head><body>");

        printWindow.document.write(
            `<div class="receipt">
        <div class="header">
           
            <h1>${this.restaurantDetail.restaurantName.toUpperCase()}</h1>
            <p>${this.restaurantDetail.address.street.toUpperCase()} ,${this.restaurantDetail.address.city.toUpperCase()},${this.restaurantDetail.address.state.toUpperCase()},${
                this.restaurantDetail.address.pinCode
            }</p>
        </div>
        <p style="text-align:center;margin-bottom:0px" class="captalize font-bold">${
            orderDetail.customerPreferences.preference
        }</p>
        <div  style="text-align:center">${
            orderDetail.customerPreferences.preference === "delivery"
                ? "( " + orderDetail.customerPreferences?.value.address + " )"
                : ""
        }</div>
        <p>
        <span class="space-between">
        ${this.datePipe.transform(orderDetail.orderDate)}
     <span>   ${orderDetail.orderDate.split("T")[1].split(".")[0]}</span>
        </span>
      
        Bill No: ${orderDetail.orderId}<br>
        Payment Status: : ${"Paid via " + orderDetail.payment_method}<br>
        ${orderDetail.customerName}<br>
        ${orderDetail.customerPhoneNumber} - ${orderDetail.customerEmail}<br>
       </p>

        <table class="item-table ">
            <tr  class="border-main-none">
                <th  class="border-main-none">Items</th>
                <th  class="border-main-none center">Price</th>
                <th  class="border-main-none center">Qty</th>
                <th  class="border-main-none center">Amount</th>
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
            } else {
                printWindow.document.write(
                    `<td class='border-none center'>${order.priceOneItem}</td>`
                );
                printWindow.document.write(
                    `<td class='border-none center'>${order.dishQuantity}</td>`
                );
                printWindow.document.write(
                    `<td class='border-none center'>${order.totalPrice}</td>`
                );
                printWindow.document.write("</tr>");
            }
        }

        printWindow.document.write("</table>");
        printWindow.document.write("<div class='dash-line'></div>");

        printWindow.document.write(
            `<span>Total Quantity: ${orderDetail.orderDetails[0].orderSummary.length}</span>
            `
        );
        printWindow.document.write(
            `<div class="footer">
            <p>Net Amt.</p>
            <p>${orderDetail.orderDetails[0].orderAmount}</p>
        </div>`
        );
        printWindow.document.write(
            `<div class="footer">
            <p>Tax</p>
            <p>${orderDetail.orderDetails[0].orderAmount}</p>
        </div>`
        );
        printWindow.document.write(
            `<div class="footer">
            <p>Total Amt.</p>
            <p>${orderDetail.orderDetails[0].orderAmount}</p>
        </div>`
        );
        printWindow.document.write(
            ` <div class="dash-line"></div>
            <span class="font-bold">Tax Summary</span>
            <table class="item-table">
                <tbody>
                    <tr class="border-main-none">
                        <th class="border-main-none">Tax %</th>
                        <th class="border-main-none center">Basic Amt</th>
                        <th class="border-main-none center">Tax Amt</th>
                    </tr>
                    <tr class="border-none">
                        <td class="border-none">CGST</td>
                        <td class="border-none center">11</td>
                        <td class="border-none center">11</td>
                    </tr>
                    <tr class="border-none">
                        <td class="border-none">SGST</td>
                        <td class="border-none center">180</td>
                        <td class="border-none center">180</td>
                    </tr>
                </tbody>
            </table>`
        );
        printWindow.document.write("<div class='dash-line'></div>");

        // if (orderDetail.orderDetails[0].gstAmount) {
        //     printWindow.document.write(
        //         `<div class="footer">
        //         <p>GST Amount</p>
        //         <p>${orderDetail.orderDetails[0].gstAmount}</p>
        //     </div>`
        //     );
        // }

        if (orderDetail.orderDetails[0].deliveryAmount) {
            printWindow.document.write(
                `<div class="footer">
                <p>Delivery Amount</p>
                <p>${orderDetail.orderDetails[0].deliveryAmount}</p>
            </div>`
            );
        }

        if (orderDetail.orderDetails[0].discountAmount) {
            printWindow.document.write(
                `<div class="footer">
                <p>Discount Amount</p>
                <p>${orderDetail.orderDetails[0].discountAmount}</p>
            </div>`
            );
        }

        printWindow.document.write(
            `<h1 class="center font-bold" style="margin-bottom:0px">Payable Amt.: ${orderDetail.orderDetails[0].orderAmount}</h1>`
        );
        printWindow.document.write(
            `<p class="center">Thanks for your visit !!! <br> Have a good day</p>`
        );
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
}
