import { Component, Inject, Input, OnInit } from "@angular/core";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { CustomerService } from "src/app/api/customer.service";
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialog,
} from "@angular/material/dialog";
// Import the dialog component
import { PromoCodeDetailsDialogComponent } from "../promo-code-details-dialog/promo-code-details-dialog.component";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-user-promo-code-dialog",
    templateUrl: "./user-promo-code-dialog.component.html",
    styleUrls: ["./user-promo-code-dialog.component.scss"],
})
export class UserPromoCodeDialogComponent implements OnInit {
    constructor(
        private customerService: CustomerService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UserPromoCodeDialogComponent>,
        // Inject the dialog service
        public dialog: MatDialog,
        private utilService: UtilService
    ) {}

    // @Input("restaurantData") restaurantData;

    promoCodes: any[] = [];
    promoCodeName: string = "";

    ngOnInit(): void {
        console.log(this.data);
        
        this.getPromoCodesForRestaurantUrl();
    }
    getPromoCodesForRestaurantUrl() {
        let restaurantUrl = window.location.href;

        // // take out yoursPizza from the url http://localhost:4200/restaurant?detail=yoursPizza details=
        restaurantUrl = restaurantUrl.split("?detail=")[1];

        // let restaurantUrl = this.restaurantData["restaurantUrl"];

        this.customerService
            .getPromoCodesForRestaurantUrl(restaurantUrl)
            .subscribe({
                next: (res) => {
                    console.log(res);

                    this.promoCodes = res["data"]["promoCodes"];

                    let newPromoCodes = [];

                    for (let promoCode of this.promoCodes) {
                        // Add a new property to the promo code object
                        // to indicate whether the promo code is valid or not
                        // use the checkIfPromoCodeIsValid() method to check
                        this.customerService
                            .checkIfPromoCodeIsValid(
                                promoCode["codeName"],
                                this.data.amountToBePaid,
                                restaurantUrl
                            )
                            .subscribe({
                                next: (res) => {
                                    console.log(res);

                                    promoCode["isValid"] =
                                        res["status"] == "success";

                                    promoCode["message"] = res["message"];

                                    // If the promo code is valid, add a new property
                                    // to the promo code object to indicate the discount amount
                                    if (promoCode["isValid"]) {
                                        promoCode["discountAmount"] =
                                            res["data"]["discountAmount"];
                                    }

                                    // If the promo code is invalid, add a new property
                                    // to the promo code object to indicate the reason
                                    else {
                                        promoCode["error"] = res["message"];
                                    }

                                    console.log(promoCode);

                                    // Push the promo code object to the new array
                                    newPromoCodes.push(promoCode);
                                },
                            });
                    }

                    // Replace the promo codes array with the new array
                    this.promoCodes = newPromoCodes;
                },
            });
    }

    copyPromoCode(promoCode: string) {
        // Copy the promo code to the clipboard
        const tempInput = document.createElement("input");
        tempInput.value = promoCode;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        // Optionally, you can display a message to indicate successful copy
        alert(`Promo code "${promoCode}" copied to clipboard!`);
    }

    applyPromoCode(promoCode?: string) {
        // Use the promo code parameter if provided, otherwise use the input value
        // give

        let giveError = false;

        if (promoCode) {
            this.promoCodeName = promoCode;
        } else {
            this.promoCodeName = this.promoCodeName.trim();

            if (this.promoCodeName == "") {
                this.utilService.openSnackBar("Please enter a promo code");
                return;
            }

            giveError = true;
        }

        let nowPromoCode = promoCode || this.promoCodeName;
        let restaurantUrl = window.location.href;

        // // take out yoursPizza from the url http://localhost:4200/restaurant?detail=yoursPizza details=
        restaurantUrl = restaurantUrl.split("?detail=")[1];
        this.customerService
            .checkIfPromoCodeIsValid(nowPromoCode, this.data.amountToBePaid,restaurantUrl)
            .subscribe({
                next: (res) => {
                    console.log(res);
                    if (res["status"] == "success") {
                        // Promo code is valid, apply the promo code
                        this.dialogRef.close(res["data"]);
                    } else {
                        if (giveError) {
                            this.utilService.openSnackBar(res["message"], true);
                        }
                    }
                },
            });
    }

    // Define a method to open the dialog component
    openDialog(promoCode: any) {
        // Use the dialog service to open the dialog component
        // Pass the promo code object as data to the dialog component
        const dialogRef = this.dialog.open(PromoCodeDetailsDialogComponent, {
            width: "300px",
            data: promoCode,
        });

        // Optionally, you can subscribe to the dialog close event to get the result
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed");
            console.log(result);
        });
    }
}
