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
import { RoomNoDialogComponent } from "../room-no-dialog/room-no-dialog.component";

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
        const tableData = this.cartHelperComponent.tableData;

        this.dialog
            .open(TableNumberDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: { restaurantData: this.restaurantData, tableData },
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
                    this.placeOrder();
                }
            });
    }

    customerName: string;
    customerPhoneNumber: string;

    openSelectRoomNoDialog() {
        this.dialog
            .open(RoomNoDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: {
                    restaurantData: this.restaurantData,
                },
            })
            .afterClosed()
            .subscribe((resp) => {
                if (resp && resp.selectedRoom) {
                    console.log("resp", resp);
                    this.orderOptionFlag = true;
                    this.userPreference = {
                        preference: "room service",
                        value: resp.selectedRoom.roomName,
                        userDetail: {
                            name: resp.name,
                            phoneNumber: resp.phoneNumber,
                        },
                    };
                    this.setCartStateData();
                    this.placeOrder();
                }
            });
    }
    //This one
    openOrderOptionDialog() {
        const text = this.orderOption;
        if (text === "dineIn") {
            this.openSelectTableNumberDialog();
        } else if (text === "roomService") {
            this.openSelectRoomNoDialog();
        } else if (text === "delivery") {
            this.openAddressSelectionDialog();
        } else if (text === "takeAway" || text === "scheduledDining" || text==="grabAndGo") {
            this.dialog
                .open(TimeSelectorDialogComponent, {
                    panelClass: "add-item-dialog",
                    data: { takeAwayFlag:text === "takeAway"},
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
                                    : "Grab and go",
                            value: resp.selectedTime,
                            userDetail: {
                                name: resp.name,
                                phoneNumber: resp.phoneNumber,
                            },
                        };
                        this.setCartStateData();
                        this.placeOrder();
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
            cookingInstruction: this.cartHelperComponent.cookingInstruction,
        });
    }
    //this one
    getOrderOptionText() {
        const text = this.orderOption;
        if (text === "dineIn") {
            return "Proceed to choose  table number.";
        } else if (text === "roomService") {
            return "Proceed to choose  room number.";
        } else if (text === "delivery") {
            return "Proceed to choose address.";
        } else if (text === "takeAway" || text === "scheduledDining" || text==="grabAndGo") {
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
        this.setCartStateData();
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
    placeOrder(btnAction = false) {
        this.customerData = this.customerAuthService.getUserDetail();

        console.log("Customer Data: ", this.customerData);

        this.cartHelperComponent.placeOrder(btnAction);
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
                    this.placeOrder();
                }
            }
        });
    }
}
