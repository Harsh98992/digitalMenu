import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
@Injectable({
    providedIn: "root",
})
export class AdminPanelService {
    apiUrl = environment.apiUrl;
    EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    EXCEL_EXTENSION = ".xlsx";
    constructor(private http: HttpClient) {}
    getRestaurantsByStatus(restaurantVerified) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/getRestaurantsByStatus/${restaurantVerified}`
        );
    }
    getRestaurantPayment() {
        return this.http.get(
            `${this.apiUrl}/v1/payment/getAccountPaymentDetails`
        );
    }
    getAccountTransferDetails(orderId) {
        return this.http.get(
            `${this.apiUrl}/v1/payment/getAccountTransferDetails/${orderId}`
        );
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
    public exportJsonToExcel(jsonData: any[], fileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ["data"],
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        this.saveAsExcelFile(excelBuffer, fileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
        saveAs(
            data,
            fileName + "_export_" + new Date().getTime() + this.EXCEL_EXTENSION
        );
    }
}
