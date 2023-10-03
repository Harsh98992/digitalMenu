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
    cartState = new Subject();

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
        this.cartItem.next(data);
    }
    getCartState() {
        return this.cartState.asObservable();
    }
    setCartSate(data: any) {
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
