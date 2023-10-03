import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class UserService {
    apiUrl = environment.apiUrl;

    phoneNumberValidator(
        control: AbstractControl
    ): { [key: string]: any } | null {
        const phoneNumberRegex = /^\d{10}$/;
        const isValid = phoneNumberRegex.test(control.value);
        return isValid ? null : { invalidPhoneNumber: true };
    }

    constructor(private http: HttpClient) {}
    private user = new BehaviorSubject<any>(null);

    getAllUsers() {
        return this.http.get(`${this.apiUrl}/v1/user/getAllUsers`);
    }

    addUser(userData) {
        return this.http.post(`${this.apiUrl}/v1/user/addUser`, userData);
    }

    deleteUser(userId) {
        return this.http.delete(`${this.apiUrl}/v1/user/deleteUser/${userId}`);
    }

    editUser(userId, userData) {
        return this.http.patch(
            `${this.apiUrl}/v1/user/editUser/${userId}`,
            userData
        );
    }

    getUser(userId) {
        return this.http.get(`${this.apiUrl}/v1/user/getUser/${userId}`);
    }

    getMe() {
        return this.http.get(`${this.apiUrl}/v1/user/getMe`);
    }
}
