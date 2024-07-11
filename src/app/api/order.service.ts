import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "src/environments/environment";
import { PaymentDialogComponent } from "../angular-material/payment-dialog/payment-dialog.component";
import { io } from "socket.io-client";

@Injectable({
    providedIn: "root",
})
export class OrderService {
    apiUrl = environment.apiUrl;
    constructor(private http: HttpClient, private dialog: MatDialog) {
        this.socket = io(this.socketApiUrl);
    }

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    placeOrder(data: any) {
        return this.http.post(`${this.apiUrl}/v1/orders/placeOrder`, data);
    }
    storeOrder(data: any) {
        return this.http.post(`${this.apiUrl}/v1/orders/storeOrder`, data);
    }
    getCustomerActiveOrder() {
        return this.http.get(`${this.apiUrl}/v1/orders/getCustomerActiveOrder`);
    }
    getRestaurantOrdersByStatus(data) {
        return this.http.put(
            `${this.apiUrl}/v1/orders/getRestaurantOrdersByStatus`,
            data
        );
    }
    deleteOrderById(orderId: String) {
        return this.http.delete(
            `${this.apiUrl}/v1/orders/deleteOrderById/${orderId}`
        );
    }
    changeOrderStatus(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/orders/changeOrderStatus`,
            data
        );
    }
    changeOrderStatusByUser(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/orders/changeOrderStatusByUser`,
            data
        );
    }
    changeOrderStatusByUserForCashOnDelivery(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/orders/changeOrderStatusByUserForCashOnDelivery`,
            data
        );
    }
    getCustomerOrder() {
        return this.http.get(`${this.apiUrl}/v1/orders/customerOrder`);
    }
    getOrderwithPaymentOrderId(orderId) {
        return this.http.get(`${this.apiUrl}/v1/orders/getOrderwithPaymentOrderId/${orderId}`);
    }
    getCustomerPaymentPendingOrder() {
        return this.http.get(
            `${this.apiUrl}/v1/orders/getCustomerPaymentPendingOrder`
        );
    }
    generateBill(orderId: String) {
        return this.http.get(
            `${this.apiUrl}/v1/orders/generateBill/${orderId}`
        );
    }
    downloadBill(base64String: string, filename: string) {
        const blob = this.base64toBlob(base64String, "application/pdf");
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        window.URL.revokeObjectURL(url);
    }
    base64toBlob(base64: string, mimeType: string): Blob {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mimeType });
    }
    checkForOrderWithPendingPayment() {
        // this.getCustomerPaymentPendingOrder().subscribe({
        //     next: (res: any) => {
        //         if (res && res.data && res.data?.orderData?._id)
        //             this.dialog.open(PaymentDialogComponent, {
        //                 panelClass: "add-item-dialog",
        //                 data: res.data.orderData,
        //                 disableClose: true,
        //             });
        //     },
        // });
    }
}
