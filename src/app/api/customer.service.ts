import { HttpClient } from "@angular/common/http";
import { Injectable, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class CustomerService {
    @Input("restaurantData") restaurantData;

    apiUrl = environment.apiUrl;
    // return this.http.post(`${this.apiUrl}/v1/customer/login`, data);

    constructor(private http: HttpClient) {}

    getCustomer() {
        return this.http.get(`${this.apiUrl}/v1/customer/getCustomer`);
    }

    addCustomerAddress(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/customer/addCustomerAddress`,
            data
        );
    }

    editCustomerAddress(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/customer/editCustomerAddress`,
            data
        );
    }
    sendEmail(data) {
        return this.http.post(`${this.apiUrl}/v1/customer/contactUs`, data);
    }
    deleteAddressOfRequestCustomerById(id) {
        return this.http.delete(
            `${this.apiUrl}/v1/customer/deleteAddressOfRequestCustomerById/${id}`
        );
    }

    getNearbyRestaurants(latitude, longitude) {
        return this.http.get(
            `${this.apiUrl}/v1/customer/getNearbyRestaurants?latitude=${latitude}&longitude=${longitude}`
        );
    }

    getAllRestaurants() {
        return this.http.get(`${this.apiUrl}/v1/customer/getAllRestaurants`);
    }

    getRestaurantDetailsFromRestaurantUrl(restaurantUrl) {
        return this.http.get(
            `${this.apiUrl}/v1/customer/getRestaurantDetailsFromRestaurantUrl/${restaurantUrl}`
        );
    }

    getRestaurantDetailsFromRestaurantId(restaurantId) {
        return this.http.get(
            `${this.apiUrl}/v1/customer/getRestaurantDetailsFromRestaurantId/${restaurantId}`
        );
    }

    getPromoCodesForRestaurantUrl(restaurantUrl) {
        return this.http.get(
            `${this.apiUrl}/v1/customer/getPromoCodesForRestaurantUrl/${restaurantUrl}`
        );
    }

    checkIfPromoCodeIsValid(promoCodeName, amountToBePaid, restaurantUrl) {
        const data = {
            amountToBePaid: amountToBePaid,
            restaurantUrl: restaurantUrl,
            promoCodeName: promoCodeName,
        };
        return this.http.post(
            `${this.apiUrl}/v1/customer/checkIfPromoCodeIsValid`,
            data
        );
    }

    updateCustomerData(data) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/updateCustomerData`,
            data
        );
    }

    isDineInAvailable(restaurantId) {
        return this.http.get(
            `${this.apiUrl}/v1/customer/isDineInAvailable/${restaurantId}`
        );
    }
}
