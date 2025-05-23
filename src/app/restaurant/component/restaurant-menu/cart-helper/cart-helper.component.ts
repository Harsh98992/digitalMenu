import * as _ from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { AddressSelectionComponent } from "../address/address-selection/address-selection.component";
import { Component, Input, OnInit } from "@angular/core";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { CustomerService } from "src/app/api/customer.service";
import { OrderService } from "src/app/api/order.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ShowOptionDialogComponent } from "../restaurant-cart/show-option-dialog/show-option-dialog.component";
import { TableNumberDialogComponent } from "../table-number-dialog/table-number-dialog.component";
import { TimeSelectorDialogComponent } from "../time-selector-dialog/time-selector-dialog.component";
import { UserPromoCodeDialogComponent } from "./user-promo-code-dialog/user-promo-code-dialog.component";
import { environment } from "src/environments/environment";
import { io } from "socket.io-client";
import { UtilService } from "src/app/api/util.service";
import { UserLoginComponent } from "src/app/user-auth/user-login/user-login.component";
import { PaymentDialogComponent } from "src/app/angular-material/payment-dialog/payment-dialog.component";
import { RoomNoDialogComponent } from "../room-no-dialog/room-no-dialog.component";
import { CustomerDetailsService } from "src/app/api/customer-details.service";

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
    customerName: string;
    customerPhoneNumber: string;
    defaultOrderOption = null;
    deliveryRadioText: string;
    tableData = [];
    promoCodes: any;
    rooms: any;
    isByPassAuthFlag: any;
    dineInMenuFlag: any;
    constructor(
        private restaurantService: RestaurantService,
        private customerAuthService: CustomerAuthService,
        private dialog: MatDialog,
        private orderService: OrderService,
        private customerDetailsService: CustomerDetailsService,
        private router: Router,
        private customerService: CustomerService,
        private utilityService: UtilService,
        private route: ActivatedRoute
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
        this.isByPassAuthFlag = this.restaurantData?.byPassAuth;
        this.checkForActiveRoute();
        this.getRestaurantRoom();
        this.getCartItem();
        this.checkLogin();

        this.getCartState();
        this.getPromoCodesForRestaurantUrl();
        this.customerService
            .isDineInAvailable(this.restaurantData._id)
            .subscribe({
                next: (res: any) => {
                    this.isDineInAvailable =
                        res.data.isDineInAvailable &&
                        this.restaurantData.isDineInAvailableRestaurant;
                    this.tableData = res.data.tableDetails;
                },
            });
    }
    checkForActiveRoute() {
        this.route.queryParams.subscribe((params) => {
            this.dineInMenuFlag = params?.["dining"];
        });
    }
    getPromoCodesForRestaurantUrl() {
        this.customerService
            .getPromoCodesForRestaurantUrl(this.restaurantData.restaurantUrl)
            .subscribe({
                next: (res: any) => {
                    if (res?.data?.promoCodes?.length) {
                        this.promoCodes = res.data.promoCodes;
                    }
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
    openLoginDialog() {
        this.dialog.open(UserLoginComponent, {
            minWidth: "400px",

            disableClose: true,
        });
    }

    async changeOption(e, value: string) {
        if (value === "scheduledDining") {
            e.preventDefault();
            return;
        }
        if (!this.userLoginFlag && !this.isByPassAuthFlag) {
            e.preventDefault();
            this.openLoginDialog();
            return;
        } else if (this.orderOptionFlag) {
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
            return;
        } else {
            this.setCartStateHelper();
        }
        this.openOrderOptionDialog();
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
        } else if (text === "dining") {
            this.openSelectTableNumberDialog(true);
        } else if (text === "roomService") {
            this.openSelectRoomNoDialog();
        } else if (text === "delivery") {
            this.openAddressSelectionDialog();
        } else if (
            text === "takeAway" ||
            text === "scheduledDining" ||
            text === "grabAndGo"
        ) {
            this.dialog
                .open(TimeSelectorDialogComponent, {
                    panelClass: "add-item-dialog",
                    data: { takeAwayFlag: text === "takeAway" },
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
                        this.setCartStateHelper();
                        this.placeOrder();
                    }
                });
        } else {
        }
    }
    openSelectRoomNoDialog() {
        this.dialog
            .open(RoomNoDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: {
                    restaurantData: this.restaurantData,
                    roomData: this.rooms,
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
                    this.setCartStateHelper();
                    this.placeOrder();
                }
            });
    }
    openSelectTableNumberDialog(dining = false) {
        console.log(this.tableData, "tableData");
        this.dialog
            .open(TableNumberDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: {
                    restaurantData: this.restaurantData,
                    tableData: this.tableData,
                },
            })
            .afterClosed()
            .subscribe((resp) => {
                if (resp && resp.selectedTableName) {
                    this.orderOptionFlag = true;
                    this.orderOptionFlag = true;
                    if (dining) {
                        this.userPreference = {
                            preference: "Dining",
                            value: resp.selectedTableName,
                            userDetail: {
                                name: resp.name,
                                phoneNumber: resp.phoneNumber,
                            },
                        };
                    } else {
                        this.userPreference = {
                            preference: "Dine In",
                            value: resp.selectedTableName,
                        };
                    }
                    this.setCartStateHelper();
                    this.placeOrder();
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
        this.getDeliveryRadiobuttonText();
    }
    generateAmountToBePaid() {
        let isGstApplicable = null;
        let isPricingInclusiveOfGST = null;
        let customGSTPercentage = null;
        if (this.dineInMenuFlag) {
            isGstApplicable =
                this.restaurantData?.isDineInGstApplicable ?? false;
            isPricingInclusiveOfGST =
                this.restaurantData?.isDineInPricingInclusiveOfGST ?? false;
            customGSTPercentage =
                this.restaurantData?.customDineInGSTPercentage ?? 0;
        } else {
            isGstApplicable = this.restaurantData?.isGstApplicable ?? false;
            isPricingInclusiveOfGST =
                this.restaurantData?.isPricingInclusiveOfGST ?? false;
            customGSTPercentage = this.restaurantData?.customGSTPercentage ?? 0;
        }
        if (isGstApplicable) {
            if (isPricingInclusiveOfGST) {
                const divideNumber = customGSTPercentage === 5 ? 1.05 : 1.12;
                this.itemTotalAmountShowed = Math.round(
                    this.itemTotal / divideNumber
                );
                this.gstAmount = Math.round(
                    this.itemTotal - this.itemTotalAmountShowed
                );
                this.amountToBePaid =
                    this.itemTotal - this.discountAmount + this.deliveryAmount;
            } else {
                const divideNumber = customGSTPercentage === 5 ? 1.05 : 1.12;

                this.itemTotalAmountShowed = this.itemTotal;
                this.gstAmount = Math.round(
                    this.itemTotal * divideNumber - this.itemTotal
                );
                this.amountToBePaid =
                    this.itemTotal -
                    this.discountAmount +
                    this.deliveryAmount +
                    this.gstAmount;
            }
        } else {
            this.gstAmount = Math.round(
                (this.itemTotal / 100) * customGSTPercentage
            );

            this.itemTotalAmountShowed = this.itemTotal;
            this.amountToBePaid =
                this.itemTotal +
                this.gstAmount -
                this.discountAmount +
                this.deliveryAmount;
        }
        this.restaurantService.amountToBePaidSubject.next(this.amountToBePaid);
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
                    this.setCartStateHelper();
                    this.placeOrder();
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
                obj["dishPrice"] = item.dishDetail.dishPrice;
                // obj["dishCategory"] = item.dishDetail.dishCategory;
                result.push(obj);
            }
        }
        return result;
    }

    socket: any;
    placeOrder(btnAction = false) {
        const orderData = this.getOrderItems();
        this.socket = io(this.socketUrl, {});

        let bodyData: any = [
            {
                orderSummary: orderData,
                customerPreferences: this.userPreference,
                cookingInstruction: this.cookingInstruction,
                orderAmount: this.itemTotalAmountShowed,
                restaurantId: this.restaurantData._id,
                gstAmount: this.gstAmount,
                discountAmount: this.discountAmount,
                deliveryAmount: this.deliveryAmount,
            },
        ];

        const paymentData = {
            orderDetails: bodyData,
            paymentOnlineAvailable: this.restaurantData?.paymentgatewayData
                ?.gatewayData
                ? true
                : false,
            cashOnDeliveryAvailable:
                this.restaurantData?.provideCashOnDelivery === false
                    ? false
                    : true,
            restaurantId: this.restaurantData._id,
            restaurantName: this.restaurantData?.restaurantName ?? "",
        };
        if (this.userPreference?.preference === "Dine In") {
            if (true) {
                this.placeOrderHelper(bodyData, {});
            }

            return;
        }
        this.dialog
            .open(PaymentDialogComponent, {
                panelClass: "add-item-dialog",
                data: paymentData,
                disableClose: true,
            })
            .afterClosed()
            .subscribe((paymentData) => {
                if (paymentData?.method) {
                    if (paymentData.method) {
                        this.placeOrderHelper(bodyData, paymentData);
                    }
                }
            });
    }
    placeOrderHelper(bodyData, paymentData) {
        let reqData = bodyData[0];
        const event = paymentData?.event;
        if (paymentData.method === "payOnline") {
            reqData = {
                ...reqData,
                paymentMethod: "payOnline",
                razorpay_order_id: event.detail["razorpay_order_id"],
                razorpay_payment_id: event.detail["razorpay_payment_id"],
                razorpay_signature: event.detail["razorpay_signature"],
                razorpay_tranferData: paymentData.transferDetails,
            };
        } else if (paymentData.method === "cashOnDelivery") {
            reqData = {
                ...reqData,
                paymentMethod: "cashOnDelivery",
            };
        }
        if (paymentData.method === "payOnlineWithStore") {
            this.orderService
                .getOrderwithPaymentOrderId(event.detail["razorpay_order_id"])
                .subscribe({
                    next: (res) => {
                        const orderData = res["data"]["orderData"];
                        this.restaurantService.bypassGaurd = true;
                        this.dialog.closeAll();
                        this.restaurantService.setCartItem([]);
                        this.restaurantService.setRestaurantUrl(null);
                        this.restaurantService.amountToBePaidSubject.next(null);
                        if (orderData && this.isByPassAuthFlag) {
                            this.router.navigateByUrl(
                                `/order-tracking/${orderData.orderId}/${orderData.restaurantId}`
                            );
                        } else {
                            this.router.navigateByUrl("/orders");
                        }
                    },
                });
        } else {
            this.orderService.placeOrder(reqData).subscribe({
                next: (res: any) => {
                    if (res["status"] == "success") {
                        const orderData = res["data"]["savedData"];
                        this.restaurantService.bypassGaurd = true;
                        this.socket.emit(
                            "orderPlaced",
                            res["data"]["savedData"]
                        );
                        this.dialog.closeAll();
                        this.restaurantService.setCartItem([]);
                        this.restaurantService.setRestaurantUrl(null);
                        this.restaurantService.amountToBePaidSubject.next(null);
                        if (orderData && this.isByPassAuthFlag) {
                            this.router.navigateByUrl(
                                `/order-tracking/${orderData.orderId}/${orderData.restaurantId}`
                            );
                        } else {
                            this.router.navigateByUrl("/orders");
                        }
                    }
                },
            });
        }
    }

    deliveryDisabled = false;

    emptyCart() {
        // Clear the cart items
        this.cartItems = [];

        // Update the cart in the service
        this.restaurantService.setCartItem([]);

        // Reset cart state
        this.restaurantService.setCartSate({});

        // Reset amount to be paid
        this.restaurantService.amountToBePaidSubject.next(null);

        // Recalculate totals
        this.calculateItemTotal();
    }

    getDeliveryRadiobuttonText() {
        if (this.itemTotal < this.restaurantData.minOrderValueForDelivery) {
            this.deliveryDisabled = true;
            console.log(this.userPreference);
            console.log(this.orderOption);

            this.deliveryRadioText = `Delivery (Not Available Below Rs. ${this.restaurantData.minOrderValueForDelivery})`;
            if (this.orderOption === "delivery") {
                this.userPreference = {};
                this.orderOption = null;
                this.orderOptionFlag = false;
                this.setCartStateHelper();
            }
            return;
        }
        if (this.itemTotal < this.restaurantData.minOrderValueForFreeDelivery) {
            // show rs symbol
            this.deliveryDisabled = false;
            this.deliveryRadioText = `Delivery (Rs. ${this.restaurantData.deliveryFeeBelowMinValue})`;
            return;
        }
        this.deliveryDisabled = false;
        this.deliveryRadioText = "Delivery (Free)";
        return;
    }
    getRestaurantRoom() {
        const reqBody = {
            restaurantKey: this.restaurantData._id,
        };
        this.restaurantService.getAllRoomsRestaurant(reqBody).subscribe({
            next: (res: any) => {
                if (res && res.data) {
                    this.rooms = res.data?.rooms?.room;
                }
            },
        });
    }
}
