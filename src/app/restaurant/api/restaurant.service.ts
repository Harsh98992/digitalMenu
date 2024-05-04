import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class RestaurantService {
    apiUrl = environment.apiUrl;
    cartItem = new BehaviorSubject([]);
    cartState = new BehaviorSubject({});
    amountToBePaidSubject = new BehaviorSubject(null);
    bypassGaurd = false;
    constructor(private http: HttpClient) {}
    getRestaurantData(url: string) {
        return this.http.get(
            `${this.apiUrl}/v1/restaurant/getRestaurant?restaurant=${url}`
        );
    }
    getCartItem() {
        return this.cartItem.asObservable();
    }
    setCartItem(data: any) {
        localStorage.setItem("cartItem", JSON.stringify(data));
        this.cartItem.next(data);
    }
    setRestaurantUrl(url) {
        localStorage.setItem("activeRestaurantUrl", url);
    }
    getRestaurantUrl() {
        return localStorage.getItem("activeRestaurantUrl");
    }
    getAllRoomsRestaurant(reqBody) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/getAllRoomRestaurant`,
            reqBody
        );
    }
    getOrderwithOrderId(orderId) {
        return this.http.get(
            `${this.apiUrl}/v1/orders/getOrderwithOrderId/${orderId}`
        );
    }
    getRestaurantById(restaurantId) {
        return this.http.get(
            `${this.apiUrl}/v1/restaurant/getRestaurantById/${restaurantId}`
        );
    }
    getCartSessionData() {
        const data = localStorage.getItem("cartItem");
        if (data) {
            return JSON.parse(data);
        }
    }
    getCartState() {
        return this.cartState.asObservable();
    }
    getCartStateSessionData() {
        const data = localStorage.getItem("cartState");
        if (data) {
            return JSON.parse(data);
        }
    }

    setCartSate(data: any) {
        localStorage.setItem("cartState", JSON.stringify(data));
        this.cartState.next(data);
    }
    getRestaurantReview(placeId) {
        return this.http.get(`${this.apiUrl}/v1/restaurant/reviews/${placeId}`);
    }
    placeOrder(data) {
        return this.http.post(`${this.apiUrl}/v1/payment/getCheckSum`, data);
    }
    razorPay(data: any) {
        return this.http.post(`${this.apiUrl}/v1/payment/razorpay`, data);
    }
    storeRestaurnat(data) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/storeRestaurant`,
            data
        );
    }
    getPastRestaurantData(reqData) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/getCustomerPreviousRestaurant`,
            reqData
        );
    }
    checkDineInTableAvailability(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/checkDineInTableAvailability`,
            data
        );
    }
    checkActiveDineIn(restaurantId) {
        return this.http.get(
            `${this.apiUrl}/v1/restaurant/checkAciveDineIn/${restaurantId}`
        );
    }
}
