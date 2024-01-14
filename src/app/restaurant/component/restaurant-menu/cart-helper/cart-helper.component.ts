import * as _ from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { AddressSelectionComponent } from "../address/address-selection/address-selection.component";
import { Component, Input, OnInit } from "@angular/core";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { CustomerService } from "src/app/api/customer.service";
import { OrderService } from "src/app/api/order.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";
import { Router } from "@angular/router";
import { ShowOptionDialogComponent } from "../restaurant-cart/show-option-dialog/show-option-dialog.component";
import { TableNumberDialogComponent } from "../table-number-dialog/table-number-dialog.component";
import { TimeSelectorDialogComponent } from "../time-selector-dialog/time-selector-dialog.component";
import { UserPromoCodeDialogComponent } from "./user-promo-code-dialog/user-promo-code-dialog.component";
import { environment } from "src/environments/environment";
import { io } from "socket.io-client";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-cart-helper",
    templateUrl: "./cart-helper.component.html",
    styleUrls: ["./cart-helper.component.scss"],
})
export class CartHelperComponent implements OnInit {
    @Input("restaurantData") restaurantData;
    cartItems = [];
    Object = Object;
    itemTotal: number;
    userLoginFlag = false;
    showCookingRequestFlag = false;
    amountToBePaid = 0;
    gstAmount: number;
    itemTotalAmountShowed: number;
    orderOption = null;
    orderOptionFlag = false;
    userPreference = {} as any;
    cookingInstruction = "";
    promoCode: string = "";
    discountPercent: number = 0; // Example: 10% discount
    totalBill: number = 100; // Example: Initial total bill amount
    promoCodeApplied: boolean = false; // Flag to indicate if promo code is applied
    socketUrl = environment.socketApiUrl;
    isDineInAvailable: boolean = true;

    razorPayData: any;
    discountAmount: any = 0;
    deliveryAmount: any;

    defaultOrderOption = null;
    constructor(
        private restaurantService: RestaurantService,
        private customerAuthService: CustomerAuthService,
        private dialog: MatDialog,
        private orderService: OrderService,
        private router: Router,
        private customerService: CustomerService,
        private utilityService: UtilService
    ) {}

    applyPromoCode() {
        this.dialog
            .open(UserPromoCodeDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: {
                    amountToBePaid: this.amountToBePaid,
                },
            })
            .afterClosed()
            .subscribe((resp) => {
                if (resp && resp.promoCode) {
                    this.promoCode = resp["promoCode"];
                    this.discountAmount = resp["discountAmount"];
                    this.calculateItemTotal();
                    this.calculateDiscount();
                    this.promoCodeApplied = true;
                }
            });
    }

    calculateDiscount() {
        this.totalBill -= (this.totalBill * this.discountPercent) / 100;
        this.showAlert("Promo code applied successfully!");
    }
    showAlert(message: string) {
        alert(message);
    }

    ngOnInit(): void {
        this.getCartItem();
        this.checkLogin();

        this.getCartState();

        this.customerService
            .isDineInAvailable(this.restaurantData._id)
            .subscribe({
                next: (res: any) => {
                    this.isDineInAvailable = res.data.isDineInAvailable;
                },
            });
    }

    getCartState() {
        this.restaurantService.cartState.subscribe({
            next: (res: any) => {
                this.orderOption = res?.orderOption;
                this.orderOptionFlag = res?.orderOptionFlag;
                this.userPreference = res?.userPreference;
                this.cookingInstruction = res?.cookingInstruction;
                this.calculateItemTotal();
                if (res?.cookingInstruction) {
                    this.showCookingRequestFlag = true;
                } else {
                    this.showCookingRequestFlag = false;
                }
            },
        });
    }

    async changeOption(e, value: string) {
        if (this.orderOptionFlag) {
            e.preventDefault();

            let confirm = await this.showConfirm();

            if (!confirm) {
                return;
            } else {
                this.orderOptionFlag = false;
            }
        }
        this.orderOption = value;
        if (this.orderOption === "dineIn") {
            this.restaurantService
                .checkActiveDineIn(this.restaurantData._id)
                .subscribe({
                    next: (res: any) => {
                        if (res?.data?.active) {
                            this.orderOptionFlag = true;
                            this.userPreference = {
                                preference: "Dine In",
                                value: res.data.tableName,
                            };
                        }
                        this.setCartStateHelper();
                    },
                });
        } else if (
            this.orderOption === "delivery" &&
            this.itemTotal < this.restaurantData.minOrderValueForDelivery
        ) {
            this.utilityService.openSnackBar(
                `Delivery not available below Rs. ${this.restaurantData.minOrderValueForDelivery}`,
                true
            );
            this.orderOption = null;
        } else {
            this.setCartStateHelper();
        }
    }
    setCartStateHelper() {
        this.restaurantService.setCartSate({
            orderOption: this.orderOption,
            orderOptionFlag: this.orderOptionFlag,
            userPreference: this.userPreference,
            cookingInstruction: this.cookingInstruction,
        });
    }
    showConfirm() {
        return new Promise((resolve) => {
            const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: "Change Value",
                    message: "Are you sure, you want to change?",
                },
            });
            confirmDialog.afterClosed().subscribe((result) => {
                if (result?.okFlag) {
                    resolve(true);
                }
                resolve(false);
            });
        });
    }
    openOrderOptionDialog() {
        const text = this.orderOption;
        if (text === "dineIn") {
            this.openSelectTableNumberDialog();
        } else if (text === "delivery") {
            this.openAddressSelectionDialog();
        } else if (text === "takeAway" || text === "scheduledDining") {
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
                    }
                });
        } else {
        }
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
                }
            });
    }

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

    getCartItem() {
        this.restaurantService
            .getCartItem()
            .pipe()
            .subscribe({
                next: (res) => {
                    this.cartItems = res;
                    this.calculateItemTotal();
                },
            });
    }
    toggleCookingRequest() {
        this.showCookingRequestFlag = !this.showCookingRequestFlag;
    }
    calculateItemTotal() {
        this.itemTotal = 0;
        let totalAmount = 0;
        this.deliveryAmount = 0;
        this.getDeliveryRadiobuttonText();
        for (const item of this.cartItems) {
            for (const dish of item.cartItems) {
                totalAmount += dish.totalPrice;
            }
        }
        if (
            this.userPreference?.preference === "delivery" &&
            this.userPreference.value
        ) {
            if (
                totalAmount &&
                totalAmount < this.restaurantData?.minOrderValueForFreeDelivery
            ) {
                this.deliveryAmount = this.restaurantData
                    ?.deliveryFeeBelowMinValue
                    ? this.restaurantData?.deliveryFeeBelowMinValue
                    : 0;
            }
        } else {
            this.deliveryAmount = 0;
        }
        this.itemTotal = totalAmount;

        this.generateAmountToBePaid();
    }
    generateAmountToBePaid() {
        if (this.restaurantData?.isPricingInclusiveOfGST) {
            const divideNumber =
                this.restaurantData.customGSTPercentage === 5 ? 1.05 : 1.12;
            this.itemTotalAmountShowed = Math.round(
                this.itemTotal / divideNumber
            );
            this.gstAmount = Math.round(
                this.itemTotal - this.itemTotalAmountShowed
            );
            this.amountToBePaid =
                this.itemTotal - this.discountAmount + this.deliveryAmount;
        } else {
            this.gstAmount = Math.round(
                (this.itemTotal / 100) * this.restaurantData.customGSTPercentage
            );

            this.itemTotalAmountShowed = this.itemTotal;
            this.amountToBePaid =
                this.itemTotal +
                this.gstAmount -
                this.discountAmount +
                this.deliveryAmount;
        }
    }
    changeQuantity(flag: string, cartItem: any) {
        if (
            flag === "inc" &&
            cartItem["dishQuantity"] &&
            cartItem["dishQuantity"] < 50
        ) {
            cartItem["dishQuantity"] = cartItem["dishQuantity"] + 1;
            cartItem["totalPrice"] =
                cartItem["totalPrice"] + cartItem["priceOneItem"];
            this.calculateItemTotal();
        } else if (
            flag === "dec" &&
            cartItem["dishQuantity"] &&
            cartItem["dishQuantity"] > 1
        ) {
            cartItem["dishQuantity"] = cartItem["dishQuantity"] - 1;
            cartItem["totalPrice"] =
                cartItem["totalPrice"] - cartItem["priceOneItem"];
            this.calculateItemTotal();
        }
        this.orderOption = this.defaultOrderOption;
    }

    showCartItem() {
        return this.cartItems.length ? true : false;
    }
    removeItem(item, i, cartItemIndex) {
        item.cartItems.splice(i, 1);
        if (item.cartItems && item.cartItems.length === 0) {
            this.cartItems.splice(cartItemIndex, 1);
        }

        this.calculateItemTotal();
    }

    showOptionDetail(item) {
        const dialogRef = this.dialog.open(ShowOptionDialogComponent, {
            panelClass: "add-item-dialog",
            disableClose: true,
            data: item,
        });
    }
    openAddressSelectionDialog() {
        const dialogRef = this.dialog.open(AddressSelectionComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
        });

        dialogRef.afterClosed().subscribe((resp) => {
            if (resp) {
                // Handle the selected address (Add logic to update the delivery address)

                if (resp && resp.selectedAddress) {
                    this.calculateItemTotal();
                    this.orderOptionFlag = true;

                    this.userPreference = {
                        preference: "delivery",

                        value: resp.selectedAddress,
                    };
                }
            }
        });
    }
    getOrderItems() {
        const result = [];
        for (const data of this.cartItems) {
            for (const item of data.cartItems) {
                const obj = {};
                obj["dishChoicesSelected"] = item.dishChoicesSelected;
                obj["extraSelected"] = item.extraSelected;
                obj["itemSizeSelected"] = item.itemSizeSelected;
                obj["dishQuantity"] = item.dishQuantity;
                obj["priceOneItem"] = item.priceOneItem;
                obj["totalPrice"] = item.totalPrice;
                obj["dishType"] = item.dishDetail.dishType;
                obj["dishName"] = item.dishDetail.dishName;
                obj["dishId"] = item.dishDetail._id;
                result.push(obj);
            }
        }
        return result;
    }

    socket: any;
    placeOrder() {
        const orderData = this.getOrderItems();
        this.socket = io(this.socketUrl, {});

        const bodyData = {
            orderSummary: orderData,
            customerPreferences: this.userPreference,
            cookingInstruction: this.cookingInstruction,
            orderAmount: this.itemTotalAmountShowed,
            restaurantId: this.restaurantData._id,
            gstAmount: this.gstAmount,
            discountAmount: this.discountAmount,
            deliveryAmount: this.deliveryAmount,
        };
       
        this.orderService.placeOrder(bodyData).subscribe({
            next: (res: any) => {
                if (res["status"] == "success") {
                    this.socket.emit("orderPlaced", res["data"]["savedData"]);
                    this.dialog.closeAll();
                    if (this.userPreference.preference === "Dine In") {
                        this.router.navigateByUrl("/orders");

                        this.router.navigate([
                            "/order-tracking",
                            res["data"]["savedData"]["orderId"],
                        ]);
                    }
                    this.restaurantService.setCartItem([]);
                    this.restaurantService.setRestaurantUrl(null);
                }
            },
        });
    }

    deliveryDisabled = false;

    getDeliveryRadiobuttonText() {
        if (this.itemTotal < this.restaurantData.minOrderValueForDelivery) {
            this.deliveryDisabled = true;
            return `Delivery (Not Available Below Rs. ${this.restaurantData.minOrderValueForDelivery})`;
        }
        if (this.itemTotal < this.restaurantData.minOrderValueForFreeDelivery) {
            // show rs symbol
            return `Delivery (Rs. ${this.restaurantData.deliveryFeeBelowMinValue})`;
        }
        return "Delivery (Free)";
    }
}
