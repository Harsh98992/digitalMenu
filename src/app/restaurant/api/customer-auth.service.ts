import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { OrderService } from "src/app/api/order.service";
import { UtilService } from "src/app/api/util.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class CustomerAuthService {
    apiUrl = environment.apiUrl;
    customerDetail = new BehaviorSubject(null);
    constructor(private http: HttpClient, private orderService: OrderService,private utilService:UtilService) {}

    setUserToken(token: string) {
        sessionStorage.clear()
        const driver = this.utilService.getPrinterDriver();
        localStorage.clear();
        if (driver) {
            localStorage.setItem("printerDriver", JSON.stringify(driver));
        }
        localStorage.setItem("customerToken", token);
    }
    setUserDetail(data) {
        this.customerDetail.next(data);
        localStorage.setItem("customerDetail", JSON.stringify(data));
        this.orderService.checkForOrderWithPendingPayment();
    }
    getUserDetail() {
        const data = localStorage.getItem("customerDetail");
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }
    checkUserLogin() {
        const token = this.getUserToken();
        if (token) {
            return true;
        }
        return false;
    }
    getUserToken() {
        return localStorage.getItem("customerToken");
    }
    removeToken() {
        this.customerDetail.next(null);
        const driver = this.utilService.getPrinterDriver();
        localStorage.clear();
        if (driver) {
            localStorage.setItem("printerDriver", JSON.stringify(driver));
        }
    }
    customerLogin(data) {
        return this.http.post(`${this.apiUrl}/v1/customer/login`, data);
    }
    sendWhatsappVerificationCode(data) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/sendPhoneVerificationCode`,
            data
        );
    }
    validateWhatsAppOTp(data) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/verifyPhoneVerificationCode`,
            data
        );
    }
    whatsappLogin(data) {
        return this.http.post(`${this.apiUrl}/v1/customer/whatsappLogin`, data);
    }

    getCustomerId() {
        const userDetail = this.getUserDetail();
        if (userDetail) {
            return userDetail._id;
        }
        return null;
    }
    getCustomerDetail() {
        return this.http.get(`${this.apiUrl}/v1/customer/getCustomerDetail`);
    }
    updateCustomerDetail(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/customer/updateCustomerDetail`,
            data
        );
    }

    getCustomerAddress() {
        return this.http.get(`${this.apiUrl}/v1/customer/getCustomerAddress`);
    }

    
}
