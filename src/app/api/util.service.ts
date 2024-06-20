import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "../angular-material/confirm-dialog/confirm-dialog.component";
import { ErrorDialogComponent } from "../angular-material/error-dialog/error-dialog.component";
import { PrintService } from "ng-thermal-print";
const _ = require("lodash");
@Injectable({
    providedIn: "root",
})
export class UtilService {
    constructor(
        private _snackBar: MatSnackBar,
        private datePipe: DatePipe,
        private dialog: MatDialog,
        private printService: PrintService
    ) {}
    openSnackBar(message: string, errorFlag = false, duration = 5000) {
        if (errorFlag) {
            const dialogData = {
                title: "Error",
                message: message,
                yesButtonFlag: false,
                cancelBtnText: "Ok",
            };
            this.dialog.open(ConfirmDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: dialogData,
            });
            // const dialog = this.dialog.open(ConfirmDialogComponent, {
            //     data: dialogData,
            // });
            // setTimeout(() => {
            //     dialog?.close();
            // }, 5000);
        } else {
            this._snackBar.open(message, "Ok", {
                duration,
                panelClass: errorFlag ? "red-snackbar" : "green-snackbar",
                verticalPosition: "top",
                horizontalPosition: "end",
            });
        }
    }

    getDistanceFromLatLonInKm(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    }
    formatTable(data: string[][], colWidths: number[]): string[] {
        let formattedTable: string[] = [];

        // Wrap and format each row
        data.forEach((row) => {
            let wrappedCells = row.map((cell, colIndex) =>
                this.wrapText(cell, colWidths[colIndex])
            );
            let maxLines = Math.max(
                ...wrappedCells.map((cellLines) => cellLines.length)
            );

            // Merge cells for each line
            for (let i = 0; i < maxLines; i++) {
                let line = wrappedCells
                    .map((cellLines, colIndex) =>
                        (cellLines[i] || "").padEnd(colWidths[colIndex])
                    )
                    .join("  ");
                formattedTable.push(line);
            }
        });

        return formattedTable;
    }

    wrapText(text: string, width: number): string[] {
        let wrappedText: string[] = [];
        let start = 0;

        while (start < text.length) {
            let end = start + width;
            let line = text.slice(start, end);
            wrappedText.push(line);
            start = end;
        }

        return wrappedText;
    }
    setPrinterDriver(result){
        localStorage.setItem('printer-device', JSON.stringify({ vendorId: result.vendorId, productId: result.productId }));
    }
    getPrinterDriver(){
        const device = JSON.parse(localStorage.getItem('eos-printer-device'));
        return device
    }
    printEPOSReciept(orderData, restaurantDetail, kotFlag = false) {
        let orderTypeStr = "";
        const dishTableHeader = [["Items", "Price", "Qty", "Amount"]];

        const maxColWidths = [20, 5, 5, 10]; // Maximum column widths for each
        // Please convert the above style of the bill code into the typescript code for making the print content of the bill on the print window
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
                "Table Number :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "dining"
        ) {
            orderTypeStr =
                "Table Number :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "take away"
        ) {
            orderTypeStr =
                "Take Away :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "grab and go"
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
        const spaces = " ".repeat(20);
        this.printService
            .init()
            .setBold(true)

            .setJustification("center")
            .writeLine(`${restaurantDetail.restaurantName?.toUpperCase()}`);
        if (!kotFlag) {
            this.printService
                .writeLine(
                    `${restaurantDetail.address.street?.toUpperCase()} ,${restaurantDetail.address.city?.toUpperCase()},${restaurantDetail.address.state.toUpperCase()},${
                        restaurantDetail.address.pinCode
                    }`
                )
                .writeLine(
                    `${
                        restaurantDetail.gstNumber
                            ? "GST Number:- " + restaurantDetail.gstNumber
                            : ""
                    }`
                );
        }
        this.printService
            .feed(1)

            .writeLine(
                `${
                    orderDetail.customerPreferences.preference.toLowerCase() ===
                    "grab and go"
                        ? "Take away"
                        : orderDetail.customerPreferences.preference
                }`
            )
            .writeLine(`${orderTypeStr}`)
            .feed(1)
            .setJustification("left")
            .writeLine(
                `${this.datePipe.transform(
                    orderDetail.orderDate
                )} ${spaces} ${new Date(
                    orderDetail.orderDate
                ).toLocaleTimeString()}`
            )
            .writeLine(`Order ID: ${orderDetail.orderId}`);
        if (!kotFlag) {
            this.printService.writeLine(
                `Payment Status: : ${
                    orderDetail.payment_method
                        ? "Paid via " + orderDetail.payment_method
                        : "Pending"
                }`
            );
        }
        this.printService.writeLine(`${orderDetail.customerName}`);
        if (!kotFlag) {
            this.printService.writeLine(
                `${orderDetail.customerPhoneNumber} - ${orderDetail.customerEmail}`
            );
        }
        if (kotFlag) {
            this.printService.writeLine(
                `Cooking Instructions: ${
                    orderDetail?.orderDetails?.[0].cookingInstruction ?? ""
                }`
            );
        }
        this.printService.writeLine(
            "------------------------------------------------"
        );
        if (!kotFlag) {
            const formattedTable = this.formatTable(
                dishTableHeader,
                maxColWidths
            );
            formattedTable.forEach((line) => {
                this.printService.writeLine(line);
            });
            this.printService.writeLine(
                "------------------------------------------------"
            );
            let dishArr = [];
            for (const order of orderDetail.orderDetails[0].orderSummary) {
                let temp = [];
                let orderStr = `${order.dishName}`;
                let orderDishStr = this.dishNameWithExtra(order);
                var checkIfFirst = true;
                if (order.extraSelected && order.extraSelected.length) {
                    for (const extra of order.extraSelected) {
                        if (checkIfFirst) {
                            orderStr += ` with ${extra.addOnDisplayName}(${extra.addOnsSelected[0].addOnName})`;
                            checkIfFirst = false;
                        } else {
                            orderStr += ` and ${extra.addOnDisplayName}(${extra.addOnsSelected[0].addOnName})`;
                        }
                    }
                }
                temp.push(`${orderStr} ${orderDishStr}`);
                temp.push(`${order.priceOneItem}`);
                temp.push(`${order.dishQuantity}`);
                temp.push(`${order.totalPrice}`);
                dishArr.push(temp);
            }

            const formattedTableDish = this.formatTable(dishArr, maxColWidths);
            formattedTableDish.forEach((line) => {
                this.printService.writeLine(line);
            });
            this.printService.writeLine(
                "------------------------------------------------"
            );
        } else {
            const kotHeader = [["Items", "Qty"]];
            const kotCol = [20, 20];
            const formattedTableKot = this.formatTable(kotHeader, kotCol);
            formattedTableKot.forEach((line) => {
                this.printService.writeLine(line);
            });
            this.printService.writeLine(
                "------------------------------------------------"
            );
            let dishArr = [];
            for (const order of orderDetail.orderDetails[0].orderSummary) {
                let temp = [];
                let orderStr = `${order.dishName}`;

                let orderDishStr = this.dishNameWithExtra(order);
                temp.push(`${orderStr} ${orderDishStr}`);

                temp.push(`${order.dishQuantity}`);

                dishArr.push(temp);
            }
            const formattedTableDish = this.formatTable(dishArr, kotCol);
            formattedTableDish.forEach((line) => {
                this.printService.writeLine(line);
            });
            this.printService.writeLine(
                "------------------------------------------------"
            );
        }
        this.printService.writeLine(
            `Total Quantity: ${orderDetail.orderDetails[0].orderSummary.length}`
        );
        if (!kotFlag) {
            if (restaurantDetail.isGstApplicable) {
                this.printService
                    .writeLine(
                        `Net Amt. ${spaces}  ${orderDetail.orderDetails[0].orderAmount}`
                    )
                    .writeLine(
                        `Tax (${
                            orderDetail.customerPreferences.preference.toLowerCase() ===
                            "dining"
                                ? restaurantDetail.customDineInGSTPercentage
                                : restaurantDetail.customGSTPercentage
                        }%) ${spaces}  ${orderDetail.orderDetails[0].gstAmount}`
                    );
            }
            this.printService.writeLine(
                `Total Amt. ${spaces}${
                    orderDetail.orderDetails[0].orderAmount +
                    orderDetail.orderDetails[0].gstAmount
                }`
            );
            this.printService.writeLine(
                "------------------------------------------------"
            );
            if (restaurantDetail.isGstApplicable) {
                const maxColWidthsForTax = [15, 15, 10];
                const taxHeader = [
                    [
                        `Tax (${
                            orderDetail.customerPreferences.preference.toLowerCase() ===
                            "dining"
                                ? restaurantDetail.customDineInGSTPercentage
                                : restaurantDetail.customGSTPercentage
                        }%)`,
                        "Basic Amt",
                        "Tax Amt",
                    ],
                ];
                this.printService.writeLine("Tax Summary");
                this.printService.writeLine(
                    "------------------------------------------------"
                );
                const formattedTableHeadertax = this.formatTable(
                    taxHeader,
                    maxColWidthsForTax
                );
                formattedTableHeadertax.forEach((line) => {
                    this.printService.writeLine(line);
                });

                this.printService.writeLine(
                    "------------------------------------------------"
                );
                const taxArr = [
                    [
                        `CGST (${
                            orderDetail.customerPreferences.preference.toLowerCase() ===
                            "dining"
                                ? restaurantDetail.customDineInGSTPercentage / 2
                                : restaurantDetail.customGSTPercentage / 2
                        }%)`,
                        `${orderDetail.orderDetails[0].orderAmount}`,
                        `${orderDetail.orderDetails[0].gstAmount / 2}`,
                    ],
                    [
                        `SGST (${
                            orderDetail.customerPreferences.preference.toLowerCase() ===
                            "dining"
                                ? restaurantDetail.customDineInGSTPercentage / 2
                                : restaurantDetail.customGSTPercentage / 2
                        }%)`,
                        `${orderDetail.orderDetails[0].orderAmount}`,
                        `${orderDetail.orderDetails[0].gstAmount / 2}`,
                    ],
                ];
                const formattedTableHeadertaxDetail = this.formatTable(
                    taxArr,
                    maxColWidthsForTax
                );
                formattedTableHeadertaxDetail.forEach((line) => {
                    this.printService.writeLine(line);
                });
                this.printService.writeLine(
                    "------------------------------------------------"
                );
            }
            this.printService
                .setJustification("center")
                .writeLine(
                    `Payable Amt.: ${
                        orderDetail.orderDetails[0].orderAmount +
                        orderDetail.orderDetails[0].gstAmount
                    }`
                )
                .writeLine("Thanks for your visit !!! <br> Have a good day");
        }
        this.printService.feed(4);

        this.printService.cut();
        this.printService.flush();
    }
    printReceipt(orderData, restaurantDetail) {
        let orderTypeStr = "";

        // Please convert the above style of the bill code into the typescript code for making the print content of the bill on the print window
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
                "Table Number :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "dining"
        ) {
            orderTypeStr =
                "Table Number :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "take away"
        ) {
            orderTypeStr =
                "Take Away :- " + orderDetail.customerPreferences.value;
        } else if (
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "grab and go"
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

            <h1>${restaurantDetail.restaurantName?.toUpperCase()}</h1>
            <p>${restaurantDetail.address.street?.toUpperCase()} ,${restaurantDetail.address.city?.toUpperCase()},${restaurantDetail.address.state.toUpperCase()},${
                restaurantDetail.address.pinCode
            }</p>
            <p>${
                restaurantDetail.gstNumber
                    ? "GST Number:- " + restaurantDetail.gstNumber
                    : ""
            }</p>
        </div>
        <p style="text-align:center;margin-bottom:0px" class="captalize font-bold">${
            orderDetail.customerPreferences.preference.toLowerCase() ===
            "grab and go"
                ? "Take away"
                : orderDetail.customerPreferences.preference
        }</p>
        <div  style="text-align:center">${orderTypeStr}



        </div>
        <p>
        <span class="space-between">
        ${this.datePipe.transform(orderDetail.orderDate)}
     <span>   ${new Date(orderDetail.orderDate).toLocaleTimeString()}</span>
        </span>

        Order ID: ${orderDetail.orderId}<br>
        Payment Status: : ${
            orderDetail.payment_method
                ? "Paid via " + orderDetail.payment_method
                : "Pending"
        }<br>
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
            let orderStr = this.dishNameWithExtra(order);
            
            printWindow.document.write(orderStr);
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

        printWindow.document.write("</table>");
        printWindow.document.write("<div class='dash-line'></div>");

        printWindow.document.write(
            `<span>Total Quantity: ${orderDetail.orderDetails[0].orderSummary.length}</span>
            `
        );
        if (restaurantDetail.isGstApplicable) {
            printWindow.document.write(
                `<div class="footer">
            <p>Net Amt.</p>
            <p class="margin-custom">${orderDetail.orderDetails[0].orderAmount}</p>
        </div>`
            );
            printWindow.document.write(
                `<div class="footer">
            <p>Tax (${
                orderDetail.customerPreferences.preference.toLowerCase() ===
                "dining"
                    ? restaurantDetail.customDineInGSTPercentage
                    : restaurantDetail.customGSTPercentage
            }%)</p>
            <p class="margin-custom">${
                orderDetail.orderDetails[0].gstAmount
            }</p>
        </div>`
            );
        }

        printWindow.document.write(
            `<div class="footer">
            <p>Total Amt.</p>
            <p class="margin-custom">${
                orderDetail.orderDetails[0].orderAmount +
                orderDetail.orderDetails[0].gstAmount
            }</p>
        </div>`
        );
        if (restaurantDetail.isGstApplicable) {
            printWindow.document.write(
                ` <div class="dash-line"></div>
            <span class="font-bold">Tax Summary</span>
            <table class="item-table">
                <tbody>
                    <tr class="border-main-none">
                        <th class="border-main-none">Tax (${
                            orderDetail.customerPreferences.preference.toLowerCase() ===
                            "dining"
                                ? restaurantDetail.customDineInGSTPercentage
                                : restaurantDetail.customGSTPercentage
                        }%)</th>
                        <th class="border-main-none center">Basic Amt</th>
                        <th class="border-main-none center">Tax Amt</th>
                    </tr>
                    <tr class="border-none">
                        <td class="border-none">CGST (${
                            orderDetail.customerPreferences.preference.toLowerCase() ===
                            "dining"
                                ? restaurantDetail.customDineInGSTPercentage / 2
                                : restaurantDetail.customGSTPercentage / 2
                        }%)</td>
                        <td class="border-none center">${
                            orderDetail.orderDetails[0].orderAmount
                        }</td>
                        <td class="border-none center">${
                            orderDetail.orderDetails[0].gstAmount / 2
                        }</td>
                    </tr>
                    <tr class="border-none">
                        <td class="border-none">SGST (${
                            orderDetail.customerPreferences.preference.toLowerCase() ===
                            "dining"
                                ? restaurantDetail.customDineInGSTPercentage / 2
                                : restaurantDetail.customGSTPercentage / 2
                        }%)</td>
                        <td class="border-none center">${
                            orderDetail.orderDetails[0].orderAmount
                        }</td>
                        <td class="border-none center">${
                            orderDetail.orderDetails[0].gstAmount / 2
                        }</td>
                    </tr>
                </tbody>
            </table>`
            );
        }
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
            `<h1 class="center font-bold" style="margin-bottom:0px">Payable Amt.: ${
                orderDetail.orderDetails[0].orderAmount +
                orderDetail.orderDetails[0].gstAmount
            }</h1>`
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
    dishNameWithExtra(order) {
        let orderStr = "";
        if (order?.itemSizeSelected?.size) {
            orderStr += ` [ Size:-${order.itemSizeSelected.size} ] ` ;
        }
        if (order.dishChoicesSelected && order.dishChoicesSelected?.length) {
            let str = "";
            for (const data of order.dishChoicesSelected) {
                for (const choice of data.choicesSelected) {
                    str += `${choice.choiceName} ,`;
                }
            }
           const res= str.slice(0, -1);
            orderStr += `[ Choices:- ${res}] `;
        }

      
        if (order.extraSelected && order.extraSelected?.length) {
            let str = "";
            for (const data of order.extraSelected) {
                for (const addon of data.addOnsSelected) {
                    str += `${addon.addOnName} ,`;
                }
            }
            const res= str.slice(0, -1);
            orderStr += `[ Extras:- ${res}] `;
        }
        return orderStr;
    }
}
