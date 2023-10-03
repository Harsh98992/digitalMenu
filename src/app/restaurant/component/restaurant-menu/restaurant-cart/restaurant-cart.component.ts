import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";
import * as _ from "lodash";
import { take } from "rxjs";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { AuthenticationService } from "src/app/api/authentication.service";
import { UserLoginComponent } from "src/app/user-auth/user-login/user-login.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TimeSelectorDialogComponent } from "../time-selector-dialog/time-selector-dialog.component";
import { OrderService } from "src/app/api/order.service";
import { AddressSelectionComponent } from "../address/address-selection/address-selection.component";
import { ShowOptionDialogComponent } from "./show-option-dialog/show-option-dialog.component";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { Router } from "@angular/router";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { CartHelperComponent } from "../cart-helper/cart-helper.component";

// import PhoneOtpComponent
import { PhoneOtpComponent } from "src/app/angular-material/phone-otp/phone-otp.component";
import { CustomerService } from "src/app/api/customer.service";
import { AddMissingInfoDialogComponent } from "../add-missing-info-dialog/add-missing-info-dialog.component";
import { TableNumberDialogComponent } from "../table-number-dialog/table-number-dialog.component";

@Component({
    selector: "app-restaurant-cart",
    templateUrl: "./restaurant-cart.component.html",
    styleUrls: ["./restaurant-cart.component.scss"],
})
export class RestaurantCartComponent implements OnInit {
    @ViewChild("cartHelperComponent") cartHelperComponent: CartHelperComponent;
    cartItems = [];

    userLoginFlag = false;

    orderOption = null;
    orderOptionFlag = false;
    userPreference = {};
    cookingInstruction = "";

    constructor(
        private restaurantService: RestaurantService,
        private customerAuthService: CustomerAuthService,
        private customerService: CustomerService,
        private dialog: MatDialog,
        private orderService: OrderService,
        public dialogRef: MatDialogRef<any>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public restaurantData: any
    ) {}

    ngOnInit(): void {
        this.getCartItem();
        this.checkLogin();

        this.getCartState();
    }
    getCartState() {
        this.restaurantService.getCartState().subscribe({
            next: (res: any) => {
                this.orderOption = res?.orderOption;
                this.orderOptionFlag = res?.orderOptionFlag;
                this.userPreference = res?.userPreference;
            },
        });
    }
    openSelectTableNumberDialog() {
        this.dialog
            .open(TableNumberDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: this.restaurantData,
            })
            .afterClosed()
            .subscribe((resp) => {
                if (resp && resp.selectedTableName) {
                    this.orderOptionFlag = true;
                    this.userPreference = {
                        preference: "Dine In",
                        value: resp.selectedTableName,
                    };
                    this.setCartStateData();
                }
            });
    }
    //This one
    openOrderOptionDialog() {
        const text = this.orderOption;
        if (text === "dineIn") {
            this.openSelectTableNumberDialog();
        } else if (text === "delivery") {
            this.openAddressSelectionDialog();
        } else if (text === "takeAway" || text === "scheduledDining") {
            // const modalRef = this.modalService.open(ChooseTimeDialogComponent,{
            //     backdrop:false,
            //     centered:true,
            // });
            this.dialog
                .open(TimeSelectorDialogComponent, {
                    panelClass: "add-item-dialog",
                    disableClose: true,
                })
                .afterClosed()
                .subscribe((resp) => {
                    if (resp && resp.selectedTime) {
                        this.orderOptionFlag = true;
                        this.userPreference = {
                            preference:
                                text === "takeAway"
                                    ? "Take Away"
                                    : "Scheduled Dining",
                            value: resp.selectedTime,
                        };
                        this.setCartStateData();
                    }
                });
        } else {
        }
    }
    showCartItem() {
        return this.cartItems.length ? true : false;
    }
    //this one
    setCartStateData() {
        this.restaurantService.setCartSate({
            orderOption: this.orderOption,
            orderOptionFlag: this.orderOptionFlag,
            userPreference: this.userPreference,
        });
    }
    //this one
    getOrderOptionText() {
        const text = this.orderOption;
        if (text === "dineIn") {
            return "Proceed to choose  table number.";
        } else if (text === "delivery") {
            return "Proceed to choose address.";
        } else if (text === "takeAway" || text === "scheduledDining") {
            return "Proceed to choose time.";
        } else {
            return "Please choose an order option.";
        }
    }
    //this one
    checkLogin() {
        this.customerAuthService.customerDetail.subscribe({
            next: (res) => {
                if (res) {
                    this.userLoginFlag = true;
                } else {
                    this.userLoginFlag = false;
                }
            },
        });
    }
    //This one
    openLoginDialog() {
        this.dialog.open(UserLoginComponent, {
            minWidth: "400px",

            disableClose: true,
        });
    }
    closeCart() {
        this.restaurantService.setCartItem(this.cartItems);
        this.dialogRef.close();
    }

    //this one
    getCartItem() {
        this.restaurantService
            .getCartItem()
            .pipe()
            .subscribe({
                next: (res) => {
                    this.cartItems = res;
                },
            });
    }

    customerData: any;
    placeOrder() {
        this.customerData = this.customerAuthService.getUserDetail();

        console.log("Customer Data: ", this.customerData);

        // check if the customer data is complete or not by checking the name, email and phone number
        if (
            !this.customerData.name ||
            !this.customerData.email ||
            !this.customerData.phoneNumber
        ) {
            let AddMissingInfoDialogComponentRef = this.dialog.open(
                AddMissingInfoDialogComponent,

                {
                    disableClose: true,
                    panelClass: "app-full-bleed-dialog",
                    data: this.customerData,
                }
            );
            AddMissingInfoDialogComponentRef.afterClosed().subscribe(
                (response) => {
                    if (response.customerData) {
                        if (!this.customerData.phoneNumber) {
                            // open the dialog to have the phone number otp verification

                            console.log(
                                "Customer Form: ",
                                response.customerData
                            );

                            const phoneNumber =
                                response.customerData.phoneNumber;
                            const reqData = {
                                phoneNumber: phoneNumber,
                                socialLogin: "sms",
                                verificationType: "update",
                            };
                            this.customerAuthService
                                .sendWhatsappVerificationCode(reqData)
                                .subscribe({
                                    next: (res) => {
                                        let PhoneOtpComponentDialogRef =
                                            this.dialog.open(
                                                PhoneOtpComponent,
                                                {
                                                    disableClose: true,
                                                    data: reqData,
                                                    panelClass:
                                                        "app-full-bleed-dialog",
                                                }
                                            );

                                        PhoneOtpComponentDialogRef.afterClosed().subscribe(
                                            (res) => {
                                                this.customerData.phoneNumber =
                                                    response.customerData.phoneNumber;

                                                if (!this.customerData.name) {
                                                    this.customerData.name =
                                                        response.customerData.name;
                                                }

                                                if (!this.customerData.email) {
                                                    this.customerData.email =
                                                        response.customerData.email;
                                                }

                                                // update the customer data
                                                this.customerService
                                                    .updateCustomerData(
                                                        this.customerData
                                                    )
                                                    .subscribe({
                                                        next: (res) => {
                                                            console.log(
                                                                "Customer data updated successfully"
                                                            );
                                                            this.customerAuthService.setUserDetail(
                                                                this
                                                                    .customerData
                                                            );

                                                            this.cartHelperComponent.placeOrder();
                                                        },
                                                    });
                                            }
                                        );
                                    },
                                });
                        } else {
                            if (!this.customerData.name) {
                                this.customerData.name =
                                    response.customerData.name;
                            }

                            if (!this.customerData.email) {
                                this.customerData.email =
                                    response.customerData.email;
                            }

                           

                            // update the customer data
                            this.customerService
                                .updateCustomerData(response.customerData)
                                .subscribe({
                                    next: (res) => {
                                        console.log(
                                            "Customer data updated successfully"
                                        );
                                        this.customerAuthService.setUserDetail(
                                            this.customerData
                                        );

                                        this.cartHelperComponent.placeOrder();
                                    },
                                });
                        }
                    }
                }
            );

            return;
        }

        this.cartHelperComponent.placeOrder();
    }
    createPaytmForm(data) {
        const paytm = data.params;

        const my_form: any = document.createElement("form");
        my_form.name = "paytm_form";
        my_form.method = "post";
        my_form.action = "https://securegw-stage.paytm.in/order/process";

        const myParams = Object.keys(paytm);
        for (let i = 0; i < myParams.length; i++) {
            const key = myParams[i];
            let my_tb: any = document.createElement("input");
            my_tb.type = "hidden";
            my_tb.name = key;
            my_tb.value = paytm[key];
            my_form.appendChild(my_tb);
        }

        document.body.appendChild(my_form);
        my_form.submit();
        // after click will fire you will redirect to paytm payment page.
        // after complete or fail transaction you will redirect to your CALLBACK URL
    }

    //this one
    openAddressSelectionDialog() {
        const dialogRef = this.dialog.open(AddressSelectionComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
        });

        dialogRef.afterClosed().subscribe((resp) => {
            if (resp) {
                // Handle the selected address (Add logic to update the delivery address)
                console.log("Selected Address: ", resp);
                if (resp && resp.selectedAddress) {
                    this.orderOptionFlag = true;
                    this.userPreference = {
                        preference: "delivery",

                        value: resp.selectedAddress,
                    };
                    this.setCartStateData();
                }
            }
        });
    }
}
