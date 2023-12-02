import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RestaurantCartComponent } from "./restaurant-cart/restaurant-cart.component";
import { AddItemComponent } from "./add-item/add-item.component";
import { RestaurantService } from "../../api/restaurant.service";
import * as _ from "lodash";
import { RestaurantPhotosComponent } from "./restaurant-photos/restaurant-photos.component";
import { RestaurantContactPopupComponent } from "./restaurant-contact-popup/restaurant-contact-popup.component";
import { take } from "rxjs";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { RepeatDialogComponent } from "src/app/angular-material/repeat-dialog/repeat-dialog.component";
import { MatTooltip } from "@angular/material/tooltip";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerAuthService } from "../../api/customer-auth.service";
import { UserLoginComponent } from "src/app/user-auth/user-login/user-login.component";
import { TimeSelectorDialogComponent } from "./time-selector-dialog/time-selector-dialog.component";
import { CartHelperComponent } from "./cart-helper/cart-helper.component";
import { AddressSelectionComponent } from "./address/address-selection/address-selection.component";
import { TableNumberDialogComponent } from "./table-number-dialog/table-number-dialog.component";
import { PhoneOtpComponent } from "src/app/angular-material/phone-otp/phone-otp.component";
import { AddMissingInfoDialogComponent } from "./add-missing-info-dialog/add-missing-info-dialog.component";
import { CustomerService } from "src/app/api/customer.service";

@Component({
    selector: "app-restaurant-menu",
    templateUrl: "./restaurant-menu.component.html",
    styleUrls: ["./restaurant-menu.component.scss"],
})
export class RestaurantMenuComponent implements OnInit {
    // @Input("restaurantData") restaurantData;
    @ViewChild("myTooltip") myTooltip: MatTooltip;
    @ViewChild("cartHelperComponent") cartHelperComponent: CartHelperComponent;
    cartFlag = false;
    Object = Object;
    showCookingRequestFlag = false;
    restaurantDetail: any;
    restaurantDetailStore: any;
    restaurantMenu: any;
    restaurantMenuStore: any;
    foodTypeFilterValue: any;
    cartItems: any = {};
    showNotFound = false;
    itemTotal = 0;
    timer = null;
    userLoginFlag = false;
    orderOption = null;
    orderOptionFlag = false;
    userPreference = {};
    cookingInstruction = "";
    bannerImage = "";
    reviews = [];

    googleMapUrl = "";

    rating = "";
    constructor(
        public dialog: MatDialog,
        private restaurantService: RestaurantService,
        private restaurantPanelService: RestaurantPanelService,
        private route: ActivatedRoute,
        private router: Router,
        private customerAuthService: CustomerAuthService,
        private customerService: CustomerService
    ) {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    ngOnInit(): void {
        this.getRestaurantData();
        this.getCartItem();
        this.checkLogin();
        this.getCartState();

        // https://www.google.com/maps/search/?api=1&query=<address>&query_place_id=<placeId>

        // const addressSchema = new mongoose.Schema({
        //     street: {
        //         type: "String",
        //     },
        //     city: {
        //         type: "String",
        //     },
        //     state: {
        //         type: "String",
        //     },
        //     pinCode: {
        //         type: "string",
        //     },
        //     googleLocation: {
        //         type: "string",
        //     },
        //     latitude: {
        //         type: Number,
        //     },
        //     longitude: {
        //         type: Number,
        //     },
        //     landmark: {
        //         type: "string",
        //     },
        // });
    }
    getCartState() {
        this.restaurantService.getCartState().subscribe({
            next: (res: any) => {
                this.orderOption = res?.orderOption;
                this.orderOptionFlag = res?.orderOptionFlag;
                this.userPreference = res?.userPreference;
                this.cookingInstruction = res?.cookingInstruction;
            },
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
    openSelectTableNumberDialog() {
        this.dialog
            .open(TableNumberDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: this.restaurantDetail,
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
    setCartStateData() {
        this.restaurantService.setCartSate({
            orderOption: this.orderOption,
            orderOptionFlag: this.orderOptionFlag,
            userPreference: this.userPreference,
            cookingInstruction: this.cookingInstruction,
        });
    }

    //this one
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
    customerData: any;
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
    openAddressSelectionDialog() {
        const dialogRef = this.dialog.open(AddressSelectionComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
            // data: this.restaurantData,
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
    openLoginDialog() {
        this.dialog.open(UserLoginComponent, {
            minWidth: "400px",

            disableClose: true,
        });
    }
    scrollTop() {
        const options: ScrollToOptions = { top: 0, behavior: "smooth" };
        window.scrollTo(options);
    }
    getItemSizeName(item) {
        return this.cartItems[item]["itemSizeSelected"]["name"] === "complete"
            ? ""
            : `( ${this.cartItems[item]["itemSizeSelected"]["name"]} )`;
    }
    getCartItem() {
        this.restaurantService.getCartItem().subscribe({
            next: (res) => {
                this.cartItems = res;
                if (this.cartItems && this.cartItems.length) {
                    this.calculateItemTotal();
                }
            },
        });
    }
    calculateItemTotal() {
        this.cartHelperComponent.calculateItemTotal();
    }
    changeQuantity(flag: string, item: any) {
        if (this.checkCustomizeable(item)) {
            if (flag === "inc") {
                this.openAddItemModal(item);
            } else {
                this.myTooltip.disabled = false;
                this.myTooltip.show();
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.myTooltip.disabled = true;
                    this.myTooltip.hide();
                }, 5000);
            }
        } else {
            const dishData = this.checkForItemAddedAlready(item._id)
                .cartItems[0];

            if (
                flag === "inc" &&
                dishData["dishQuantity"] &&
                dishData["dishQuantity"] < 50
            ) {
                dishData["dishQuantity"] = dishData["dishQuantity"] + 1;
                dishData["totalPrice"] =
                    dishData["totalPrice"] + dishData["priceOneItem"];
                this.calculateItemTotal();
            } else if (
                flag === "dec" &&
                dishData["dishQuantity"] &&
                dishData["dishQuantity"] > 0
            ) {
                dishData["dishQuantity"] = dishData["dishQuantity"] - 1;
                dishData["totalPrice"] =
                    dishData["totalPrice"] - dishData["priceOneItem"];
                if (dishData["dishQuantity"] === 0) {
                    this.deleteItemFromCart(item);
                }
                this.calculateItemTotal();
            }
        }
    }
    deleteItemFromCart(item) {
        const idx = this.cartItems.findIndex((data) => {
            return data.dishId === item._id;
        });
        if (idx > -1) {
            this.cartItems.splice(idx, 1);
        }
    }
    showCartItem() {
        return _.isEmpty(this.cartItems);
    }
    removeItem(itemId) {
        delete this.cartItems[itemId];
        this.calculateItemTotal();
    }
    checkForItemPresent(item: any) {
        const check = this.cartItems.find((data) => {
            if (data.dishId === item._id) {
                return data;
            }
            return false;
        });
        if (check) {
            return true;
        }
        return false;
    }
    getItemQuantityFromCart(item: any) {
        if (this.checkCustomizeable(item)) {
            const itemDetail = this.checkForItemAddedAlready(
                item._id
            ).cartItems;
            let total = itemDetail.reduce((acc, data) => {
                acc = acc + data.dishQuantity;
                return acc;
            }, 0);

            return total;
        } else {
            return this.checkForItemAddedAlready(item._id).cartItems[0]
                .dishQuantity;
        }
    }
    getReviews(restaurnatData) {
        const placeId = restaurnatData?.placeId;
        if (placeId) {
            this.restaurantService.getRestaurantReview(placeId).subscribe({
                next: (res: any) => {
                    if (
                        res.data &&
                        res.data.reviewData &&
                        res.data.reviewData.result
                    ) {
                        this.reviews = res.data.reviewData.result.reviews;
                        this.rating = res.data.reviewData.result.rating;
                    }
                },
            });
        }
    }
    getRestaurantData() {
        this.route.queryParams.subscribe((params) => {
            const restaurnatUrl = params["detail"];

            this.restaurantService.getRestaurantData(restaurnatUrl).subscribe({
                next: (res: any) => {
                    this.restaurantDetail = res.data;
                    this.getReviews(this.restaurantDetail);
                    console.log(this.restaurantDetail.restaurantImages);

                    if (!this.restaurantDetail) {
                        this.showNotFound = true;
                        return;
                        // this.router.navigateByUrl("/notFound")
                    }
                    if (this.restaurantDetail.restaurantBackgroundImage) {
                        this.bannerImage = `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('${this.restaurantDetail.restaurantBackgroundImage}')`;
                    }
                    this.storeRestaurantInfo(restaurnatUrl);
                    this.restaurantPanelService.restaurantData.next(
                        this.restaurantDetail
                    );
                    this.restaurantMenuStore = _.clone(
                        this.restaurantDetail.cuisine
                    );
                    this.restaurantMenu = _.clone(
                        this.restaurantDetail.cuisine
                    );

                    this.googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${this.restaurantDetail?.restaurantName},${this.restaurantDetail?.address?.street},${this.restaurantDetail?.address?.city},${this.restaurantDetail?.address?.state},${this.restaurantDetail?.address?.pinCode}&query_place_id=${this.restaurantDetail?.googlePlaceId}`;
                },
            });
        });
    }
    storeRestaurantInfo(restaurantUrl: string) {
        this.customerAuthService.customerDetail.subscribe({
            next: (res) => {
                const existsCheck = this.urlExistsHelper(res, restaurantUrl);

                if (res && !existsCheck) {
                    const reqData = {
                        restaurantId: this.restaurantDetail._id,
                        email: res.email,
                    };
                    this.restaurantService.storeRestaurnat(reqData).subscribe({
                        next: (res: any) => {
                            if (res.updatedUserData) {
                                this.customerAuthService.setUserDetail(
                                    res.updatedUserData
                                );
                            }
                        },
                    });
                }
            },
        });
    }
    navigateToSection(menu, index) {
        const section = document.getElementById(menu._id);


        if (section) {
            if (index === 0) {
                section.scrollIntoView({ block: "center" });
            } else {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }
    }
    urlExistsHelper(res: any, restaurantUrl) {
        if (res && res.previousRestaurant) {
            for (const data of res.previousRestaurant) {
                if (data.restaurantId === this.restaurantDetail._id) {
                    return true;
                }
            }
        }
        return false;
    }
    openPhotoDialog() {
        this.dialog.open(RestaurantPhotosComponent, {
            panelClass: "app-full-bleed-dialog",
            data: this.restaurantDetail,
        });
    }
    openContactPopUp() {
        this.dialog.open(RestaurantContactPopupComponent, {
            panelClass: "add-item-dialog",
            disableClose: true,
            data: this.restaurantDetail,
        });
    }
    openDialog() {
        // this.restaurantService.setCartItem(this.cartItems);
        this.cartFlag = true;

        const dialogRef = this.dialog.open(RestaurantCartComponent, {
            maxWidth: "100vw",
            maxHeight: "100vh",
            height: "100%",
            width: "100%",
            data: this.restaurantDetail,
            panelClass: "app-full-bleed-dialog",
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.cartFlag = false;
        });
    }
    toggleCookingRequest() {
        this.showCookingRequestFlag = !this.showCookingRequestFlag;
    }
    openAddItemHelper(dish) {
        const dialogRef = this.dialog.open(AddItemComponent, {
            panelClass: "add-item-dialog",
            disableClose: true,
            data: dish,
        });
    }
    openAddItemModal(dish: any) {
        if (!this.cartItems || this.cartItems.length === 0) {
            this.restaurantService.setCartSate({});
        }

        if (
            (dish.sizeAvailable && dish.sizeAvailable.length > 0) ||
            (dish.addOns && dish.addOns.length > 0) ||
            (dish.choicesAvailable && dish.choicesAvailable.length > 0)
        ) {
            const checkExist = this.checkForItemAddedAlready(dish._id);
            if (checkExist) {
                const dialogRef = this.dialog
                    .open(RepeatDialogComponent, {
                        panelClass: "add-item-dialog",
                        disableClose: true,
                        data: dish,
                    })
                    .afterClosed()
                    .subscribe((res) => {
                        // received data from dialog-component
                        if (res.flag) {
                            const idx = checkExist.cartItems.length - 1;
                            checkExist.cartItems[idx].dishQuantity =
                                checkExist.cartItems[idx].dishQuantity + 1;
                            checkExist.cartItems[idx].totalPrice =
                                checkExist.cartItems[idx].totalPrice +
                                checkExist.cartItems[idx].priceOneItem;
                            this.calculateItemTotal();
                        } else {
                            this.openAddItemHelper(dish);
                        }
                    });
            } else {
                this.openAddItemHelper(dish);
            }
        } else {
            const data: any = {};
            data["totalPrice"] = dish.dishPrice;
            data["priceOneItem"] = dish.dishPrice;
            data["dishQuantity"] = 1;
            data["itemSizeSelected"] = [];
            data["extraSelected"] = [];
            data["dishDetail"] = dish;
            const storeData = {
                dishId: dish._id,
                cartItems: [data],
            };
            this.restaurantService
                .getCartItem()
                .pipe(take(1))
                .subscribe((res: any) => {
                    const initalValue = res;
                    initalValue.push(storeData);
                    this.restaurantService.setCartItem(initalValue);
                });
        }
    }
    checkForItemAddedAlready(id: string) {
        const check = this.cartItems.find((data) => {
            if (data.dishId === id) {
                return data;
            }
            return false;
        });
        if (check) {
            return check;
        }
        return false;
    }
    checkCustomizeable(dish) {
        if (
            (dish.sizeAvailable && dish.sizeAvailable.length > 0) ||
            (dish.addOns && dish.addOns.length > 0) ||
            (dish.choicesAvailable && dish.choicesAvailable.length > 0)
        ) {
            return true;
        } else {
            return false;
        }
    }
    convertTitleCase(text: string) {
        const result = text.replace(/([A-Z])/g, " $1");

        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

        return finalResult;
    }
    changeDishType(event: any, searchValue: any) {
        this.filterRestaurantMenu(event.target.value, searchValue);
    }
    filterRestaurantMenu(filterValue: string, searchText = "") {
        let result: any = [];

        const final = [];

        for (const cuisine of this.restaurantMenuStore) {
            const temp: any = {};

            temp["categoryName"] = cuisine.categoryName;
            temp["_id"] = cuisine._id;
            temp["items"] = [];

            for (let dish of cuisine["items"]) {
                if (
                    (filterValue === "all" || dish.dishType === filterValue) &&
                    dish.dishName.toLowerCase().includes(searchText) &&
                    dish.orderOption !== "none"  // Exclude dishes with order option set to "none"
                ) {
                    result.push(dish);
                }
            }

            temp["items"] = result;
            final.push(temp);
            result = [];
        }

        this.restaurantMenu = final;
    }

    searchDishes(event: any, foodSelect: any) {
        const searchText = event.target.value.toLowerCase();

        this.filterRestaurantMenu(foodSelect, searchText);
    }
}
