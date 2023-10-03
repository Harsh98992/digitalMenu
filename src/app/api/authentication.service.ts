import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { CustomerAuthService } from "../restaurant/api/customer-auth.service";

@Injectable({
    providedIn: "root",
})
export class AuthenticationService {
    apiUrl = environment.apiUrl;
    userDetail = new BehaviorSubject(null);
    constructor(private http: HttpClient,private customerAuth:CustomerAuthService) {}

    changePassword(requestData) {
        return this.http.patch(
            `${this.apiUrl}/v1/user/updatePassword`,
            requestData
        );
    }

    resetPassword(password: string, token: string) {
        return this.http.patch(
            `${this.apiUrl}/v1/user/resetPassword/${token}`,
            {
                password,
            }
        );
    }

    register(userData) {
        return this.http.post(`${this.apiUrl}/v1/user/signup`, userData);
    }
    login(userData: { email: string; password: string }) {
        this.customerAuth.removeToken()
        return this.http.post(`${this.apiUrl}/v1/user/login`, userData);
    }
    forgotPassword(email: string) {
        return this.http.post(`${this.apiUrl}/v1/user/forgotPassword`, {
            email,
        });
    }

    sendEmailVerificationOtp(email: string) {
        console.log("email", email);
        const data = { email };
        return this.http.post(`${this.apiUrl}/v1/user/emailVerification`, data);
    }

    verifyEmailOtp(otp: string, email: string) {
        return this.http.put(`${this.apiUrl}/v1/user/verifyEmailOtp`, {
            otp,
            email,
        });
    }
    setUserToken(token: string) {
        sessionStorage.clear();
        localStorage.clear()
        sessionStorage.setItem("authToken", token);
    }
    setUserDetail(data) {
        this.userDetail.next(data);
        sessionStorage.setItem("userDetail", JSON.stringify(data));
    }
    getUserDetail() {
        const data = sessionStorage.getItem("userDetail");
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
        return sessionStorage.getItem("authToken");
    }
    removeToken() {
        sessionStorage.clear();
    }
}
