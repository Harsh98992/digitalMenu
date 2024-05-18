import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class AdminPanelService {
    apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) {}
    getRestaurantsByStatus(restaurantVerified) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/getRestaurantsByStatus/${restaurantVerified}`
        );
    }
    getRestaurantPayment() {
        return this.http.get(`${this.apiUrl}/v1/payment/getAccountPaymentDetails`);
    }
    getAccountTransferDetails(orderId) {
        return this.http.get(`${this.apiUrl}/v1/payment/getAccountTransferDetails/${orderId}`);
    }
    getAdminRestaurantData(id: string) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/getRestaurantDetail/${id}`
        );
    }
    changeRestaurantStatus(id: string, data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/admin/changeRestaurantStatus/${id}`,
            data
        );
    }

    editRestaurant(id: string, data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/admin/editRestaurant/${id}`,
            data
        );
    }

    viewAllUsersOfRestaurant(id: string) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/viewAllUsersOfRestaurant/${id}`
        );
    }

    sendEmailToRestaurant(data: any) {
        return this.http.post(
            `${this.apiUrl}/v1/admin/sendEmailToRestaurant`,
            data
        );
    }
}
