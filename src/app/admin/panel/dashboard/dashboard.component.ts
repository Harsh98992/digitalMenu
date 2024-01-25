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
    constructor(
        private restaurantService: RestaurantPanelService,
        private orderService: OrderService,
        private modalService: NgbModal,
        public dialog: MatDialog,
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
        this.orderService.getRestaurantOrdersByStatus(reqData).subscribe({
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

    printReceipt(orderDetail: any) {
        console.log("printReceipt", orderDetail);

        // <h1>Order Details</h1>
        // <p>Order Id: {{details.orderId}}</p>
        // <!-- <p>Order Date: {{details.orderDate | date : "medium"}}</p>
        // <p>Customer Name: {{details.customerName}}</p>
        // <p>Customer Email: {{details.customerEmail}}</p>
        // <p>Customer Phone Number: {{details.customerPhoneNumber}}</p>
        // <p>Customer Preference: {{details.customerPreferences.preference}}</p>
        // <p>Customer Preference Value: {{details.customerPreferences.value}}</p>
        // <p>Order Status: {{details.orderStatus}}</p>
        // <p>Payment Method: {{details.payment_method}}</p>

        // <h1>Order Summary</h1>

        // <table>
        //     <thead>
        //         <tr>
        //             <th>Dish Name</th>
        //             <th>Dish Quantity</th>
        //             <th>Dish Price</th>
        //             <th>Dish Type</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         <tr *ngFor="let order of details.orderSummary">
        //             <td>{{order.dishName}}</td>
        //             <td>{{order.dishQuantity}}</td>
        //             <td>{{order.totalPrice | currency : "INR" : "symbol" :
        //                 "1.0-0"}}</td>
        //             <td>{{order.dishType}}</td>
        //         </tr>
        //     </tbody>
        // </table>

        // <h1>Order Amount</h1>

        // <p>Order Amount: {{details.orderAmount | currency :
        //     "INR" : "symbol" : "1.0-0"}}</p>

        // <p *ngIf="details.gstAmount">GST Amount:
        //     {{details.gstAmount | currency : "INR" : "symbol" :
        //     "1.0-0"}}</p>
        // <p *ngIf="details.deliveryAmount">Delivery Amount:
        //     {{details.deliveryAmount | currency : "INR" :
        //     "symbol" : "1.0-0"}}</p>
        // <p *ngIf="details.discountAmount">Discount Amount:
        //     {{details.discountAmount | currency : "INR" :
        //     "symbol" : "1.0-0"}}</p>

        // <p>Prepration Time: {{details.preprationTime}}</p>
        // <p>Cooking Instruction: {{details.cookingInstruction}}
        // </p>
        // <p>Order Place Date And Time:
        //     {{details.orderPlaceDateAndTime | date : "medium"}}
        // </p> -->

        const printContent = `
        <h1>${this.restaurantDetail.restaurantName}</h1>
        <h2>
        Retail Invoice
        </h2>
        <br>
        <p>Order Id: ${orderDetail.orderId}</p>
        <p>Date: ${orderDetail.orderDate.split("T")[0]}</p>
        <p>Name: ${orderDetail.customerName}</p>
        <p>Phone no: ${orderDetail.customerPhoneNumber}</p>
        <p>Payment Method: ${orderDetail.payment_method === undefined ? "Not done Yet" : orderDetail.payment_method}</p>
        <br>
        `;

        const printWindow = window.open("", "", "height=400,width=800");
        printWindow.document.write("<html><head><title>bill</title>");

        // stylesheets
        printWindow.document.write(
            `<style>
            body {
                font-family: Arial, sans-serif;
              }
              h1, h2, p, ul, li {
                margin: 0;
                padding: 0;
              }
              h1 {
                font-size: 1.5em;
                margin-bottom: 10px;
                text-align: center;

              }
              h2 {
                font-size: 1.2em;
                margin-top: 10px;
                margin-bottom: 5px;
                text-align: center;
              }
              p, li {
                font-size: 1em;
                margin-bottom: 5px;
                padding: 8px;

              }
              ul {
                list-style-type: none;
              }

              // table

              table {
                border-collapse: collapse;
                width: 100%;
              }

                th, td {
                    text-align: center;
                    padding: 8px;
                }

                tr:nth-child(even) {background-color: #f2f2f2;}

                // table




              </style>`
        );
        printWindow.document.write("</head><body>");

        printWindow.document.write(printContent);
        printWindow.document.write("<table>");
        printWindow.document.write("<thead>");
        printWindow.document.write("<tr>");
        printWindow.document.write("<th>Dish Name</th>");
        printWindow.document.write("<th>Dish Quantity</th>");
        printWindow.document.write("<th>Dish Price</th>");
        printWindow.document.write("</tr>");
        printWindow.document.write("</thead>");
        printWindow.document.write("<tbody>");
        for (const order of orderDetail.orderDetails[0].orderSummary) {
            printWindow.document.write("<tr>");
            printWindow.document.write(`<td>${order.dishName}</td>`);
            printWindow.document.write(`<td>${order.dishQuantity}</td>`);
            printWindow.document.write(`<td>${order.totalPrice}</td>`);
            printWindow.document.write("</tr>");
        }

        // add total amount
        printWindow.document.write("<tr>");
        printWindow.document.write(`<td></td>`);
        printWindow.document.write(`<td>Order Total</td>`);
        printWindow.document.write(
            `<td>${orderDetail.orderDetails[0].orderAmount}</td>`
        );
        printWindow.document.write("</tr>");

        printWindow.document.write("</tbody>");
        printWindow.document.write("</table>");
        printWindow.document.write("<br>");

        if (orderDetail.gstAmount) {
            printWindow.document.write(
                `<p>GST Amount:${orderDetail.orderDetails[0].gstAmount}</p>`
            );
        }
        if (orderDetail.deliveryAmount) {
            printWindow.document.write(
                `<p>Delivery Amount:${orderDetail.orderDetails[0].deliveryAmount}</p>`
            );
        }
        if (orderDetail.discountAmount) {
            printWindow.document.write(
                `<p>Discount Amount:${orderDetail.orderDetails[0].discountAmount}</p>`
            );
        }
        printWindow.document.write("<br>");
        printWindow.document.write(
            `<p><b style="text-align: left" >Total Amount Paid: ${orderDetail.orderDetails[0].orderAmount}</b></p>`
        );
        printWindow.document.write("<br>");
        printWindow.document.write("</body></html>");

        printWindow.print();

        printWindow.close();
    }
}
