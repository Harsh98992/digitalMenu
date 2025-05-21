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
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { CustomerAuthService } from "../../api/customer-auth.service";
import { UserLoginComponent } from "src/app/user-auth/user-login/user-login.component";
import { TimeSelectorDialogComponent } from "./time-selector-dialog/time-selector-dialog.component";
import { CartHelperComponent } from "./cart-helper/cart-helper.component";
import { AddressSelectionComponent } from "./address/address-selection/address-selection.component";
import { UtilService } from "src/app/api/util.service";
import { TableNumberDialogComponent } from "./table-number-dialog/table-number-dialog.component";
import { CustomerService } from "src/app/api/customer.service";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { RoomNoDialogComponent } from "./room-no-dialog/room-no-dialog.component";
import { NamePhonenumberForRoomServiceComponent } from "./name-phonenumber-for-room-service/name-phonenumber-for-room-service.component";
import { environment } from "src/environments/environment";

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
    customerName = "";
    customerPhoneNumber = "";

    googleMapUrl = "";
    placeId = "";

    rating = "";

    allDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    activeRestaurantUrl: any;
    pureVegFlag = true;
    amountToBePaid: any;
    rooms: any;
    greenPalmFlag: any;
    isByPassAuthFlag: any;
    dineInMenuFlag: any;
    constructor(
        public dialog: MatDialog,
        private restaurantService: RestaurantService,
        private restaurantPanelService: RestaurantPanelService,
        private route: ActivatedRoute,
        private router: Router,
        private customerAuthService: CustomerAuthService,
        private customerService: CustomerService,
        private utilService: UtilService
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
    }
    checkForCartActiveData(url) {
        const cartData = this.restaurantService.getCartSessionData();
        const cartState = this.restaurantService.getCartSessionData();
        const restaurantActiveUrl = this.restaurantService.getRestaurantUrl();
        if (!cartData) {
            this.restaurantService.setCartItem([]);
            this.restaurantService.setCartSate([]);
            this.restaurantService.setRestaurantUrl(null);
            this.restaurantService.amountToBePaidSubject.next(null);
            return;
        }

        if (cartData?.length && restaurantActiveUrl) {
            if (restaurantActiveUrl !== this.activeRestaurantUrl) {
                const dialogData = {
                    title: "Confirm",
                    message:
                        "Your cart contains items from other restaurant. Would you like to reset your cart for adding items from this restaurant?",
                    cancelBtnText: "NO",
                    successBtnText: "YES, START AFRESH",
                };
                this.dialog
                    .open(ConfirmDialogComponent, {
                        data: dialogData,
                        disableClose: true,
                    })
                    .afterClosed()
                    .subscribe({
                        next: (res: any) => {
                            if (res && res.okFlag) {
                                this.restaurantService.setCartItem([]);
                                this.restaurantService.setCartSate([]);
                                this.restaurantService.setRestaurantUrl(null);
                                this.restaurantService.amountToBePaidSubject.next(
                                    null
                                );
                            } else {
                                this.restaurantService.setCartItem(cartData);

                                this.restaurantService.setCartSate(cartState);
                                this.router.navigateByUrl("/");
                            }
                        },
                    });
            } else {
                this.restaurantService.setCartItem(cartData);

                this.restaurantService.setCartSate(cartState);
            }
        }
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
    openSelectRoomNoDialog() {
        // Check if URL parameters for room-customer link are present
        if (this.urlRoomName && this.urlPhoneNumber) {
            console.log(
                "[DEBUG] URL parameters found, skipping room selection dialog"
            );
            console.log("[DEBUG] Room name from URL:", this.urlRoomName);
            console.log("[DEBUG] Phone number from URL:", this.urlPhoneNumber);

            // Get room data to find the matching room
            const reqBody = {
                restaurantKey: this.restaurantDetail._id,
            };

            this.restaurantService.getAllRoomsRestaurant(reqBody).subscribe({
                next: (res: any) => {
                    if (
                        res &&
                        res.data &&
                        res.data.rooms &&
                        res.data.rooms.room
                    ) {
                        const rooms = res.data.rooms.room;
                        // Find the room that matches the URL parameter
                        const matchingRoom = rooms.find(
                            (room) =>
                                room.roomName.toLowerCase() ===
                                this.urlRoomName.toLowerCase()
                        );

                        if (matchingRoom) {
                            console.log(
                                "[DEBUG] Found matching room:",
                                matchingRoom
                            );

                            // Open the contact details dialog directly with pre-populated phone number
                            const dial = this.dialog.open(
                                NamePhonenumberForRoomServiceComponent,
                                {
                                    panelClass: "add-item-dialog",
                                    data: {
                                        selectedRoom: matchingRoom,
                                        takeAway: false,
                                        prePopulatedPhoneNumber:
                                            this.urlPhoneNumber,
                                    },
                                }
                            );

                            dial.afterClosed().subscribe((re) => {
                                if (re?.okFlag) {
                                    this.orderOptionFlag = true;
                                    this.userPreference = {
                                        preference: "room service",
                                        value: matchingRoom.roomName,
                                        userDetail: {
                                            name: re?.name,
                                            phoneNumber: re?.phoneNumber,
                                        },
                                    };
                                    this.setCartStateData();
                                    this.placeOrder();
                                }
                            });
                        } else {
                            console.log(
                                "[DEBUG] No matching room found for:",
                                this.urlRoomName
                            );
                            // Fall back to normal room selection dialog
                            this.openRegularRoomNoDialog();
                        }
                    } else {
                        console.log("[DEBUG] No room data available");
                        // Fall back to normal room selection dialog
                        this.openRegularRoomNoDialog();
                    }
                },
                error: (err) => {
                    console.error("[DEBUG] Error fetching room data:", err);
                    // Fall back to normal room selection dialog
                    this.openRegularRoomNoDialog();
                },
            });
        } else {
            // No URL parameters, proceed with normal room selection dialog
            this.openRegularRoomNoDialog();
        }
    }

    // Helper method for the regular room selection dialog flow
    openRegularRoomNoDialog() {
        this.dialog
            .open(RoomNoDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: {
                    restaurantData: this.restaurantDetail,
                },
            })
            .afterClosed()
            .subscribe((resp) => {
                console.log("resp", resp);

                if (resp && resp.selectedRoom) {
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
    openOrderOptionDialog() {
        const text = this.orderOption;
        if (text === "dineIn") {
            this.openSelectTableNumberDialog();
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
                        this.setCartStateData();
                        this.placeOrder();
                    }
                });
        } else {
        }
    }
    openSelectTableNumberDialog() {
        const tableData = this.cartHelperComponent.tableData;
        this.dialog
            .open(TableNumberDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: { restaurantData: this.restaurantDetail, tableData },
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
    setCartStateData() {
        this.restaurantService.setCartSate({
            orderOption: this.orderOption,
            orderOptionFlag: this.orderOptionFlag,
            userPreference: this.userPreference,
            cookingInstruction: this.cookingInstruction,
        });
    }

    placeOrder(btnAction = false) {
        this.customerData = this.customerAuthService.getUserDetail();

        this.cartHelperComponent.placeOrder(btnAction);
    }
    customerData: any;
    getOrderOptionText() {
        const text = this.orderOption;
        if (text === "dineIn") {
            return "Proceed to choose  table number.";
        } else if (text === "roomService") {
            return "Proceed to choose  room number.";
        } else if (text === "delivery") {
            return "Proceed to choose address.";
        } else if (
            text === "takeAway" ||
            text === "scheduledDining" ||
            text === "grabAndGo"
        ) {
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
        this.cartHelperComponent?.calculateItemTotal();
        this.restaurantService.amountToBePaidSubject.subscribe({
            next: (res) => {
                this.amountToBePaid = res;
            },
        });
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

    capitalizeWords(dishName: string): string {
        return dishName
            ?.split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
    // Store URL parameters for room-customer link
    urlPhoneNumber: string = null;
    urlRoomName: string = null;

    getRestaurantData() {
        this.route.queryParams.subscribe((params) => {
            console.log("[DEBUG] URL query parameters:", params);
            console.log("[DEBUG] Raw URL:", window.location.href);

            const restaurnatUrl = params["detail"];
            this.activeRestaurantUrl = params["detail"];
            this.dineInMenuFlag = params?.["dining"];

            // Get phone number and room name from URL parameters
            let phoneNumber = params["phoneNumber"];
            let roomName = params["roomName"];

            // If parameters are not found in params, try to extract them directly from URL
            // This handles cases where Angular router might not parse the parameters correctly
            if (!phoneNumber || !roomName) {
                console.log(
                    "[DEBUG] Parameters not found in params, trying direct URL extraction"
                );
                const urlParams = new URLSearchParams(window.location.search);
                phoneNumber = phoneNumber || urlParams.get("phoneNumber");
                roomName = roomName || urlParams.get("roomName");
                console.log("[DEBUG] Parameters from direct URL extraction:", {
                    phoneNumber,
                    roomName,
                });
            }

            console.log("[DEBUG] Final parameter values:", {
                phoneNumber,
                roomName,
            });

            // Store URL parameters for later use
            this.urlPhoneNumber = phoneNumber;
            this.urlRoomName = roomName;

            // Trim the parameters to remove any whitespace
            if (phoneNumber) {
                const originalPhoneNumber = phoneNumber;
                phoneNumber = phoneNumber.trim();
                if (originalPhoneNumber !== phoneNumber) {
                    console.log(
                        "[DEBUG] Phone number trimmed from:",
                        originalPhoneNumber,
                        "to:",
                        phoneNumber
                    );
                }
            }

            if (roomName) {
                const originalRoomName = roomName;
                roomName = roomName.trim();
                if (originalRoomName !== roomName) {
                    console.log(
                        "[DEBUG] Room name trimmed from:",
                        originalRoomName,
                        "to:",
                        roomName
                    );
                }
            }

            this.checkForCartActiveData(restaurnatUrl);
            this.restaurantService.getRestaurantData(restaurnatUrl).subscribe({
                next: (res: any) => {
                    this.restaurantDetail = res.data;
                    this.isByPassAuthFlag = this.restaurantDetail?.byPassAuth;

                    // Check for room-customer link parameters but don't validate
                    if (phoneNumber && roomName) {
                        console.log(
                            "[DEBUG] Phone number and room name found in URL, but validation is disabled"
                        );
                        // Parameters are kept for navigation purposes but validation is skipped
                    } else {
                        console.log(
                            "[DEBUG] No room link parameters found in URL"
                        );
                    }

                    this.greenPalmFlag =
                        this.restaurantDetail?.restaurantName
                            ?.toLowerCase()
                            .includes("green palm") ?? false;
                    this.checkForPureVeg();

                    if (this.restaurantDetail.restaurantStatus === "offline") {
                        const dialogData = {
                            title: "Restaurant Closed",
                            yesButtonFlag: false,
                            message:
                                "We're sorry, but the selected restaurant is currently closed. Please check the operating hours and try again during their next opening time.",
                        };
                        this.dialog.open(ConfirmDialogComponent, {
                            data: dialogData,
                        });
                    }

                    // this.customerService
                    //     .getRestaurantStatus(this.restaurantDetail._id)
                    //     .subscribe({
                    //         next: (res: any) => {
                    //             if (
                    //                 res &&
                    //                 res.data &&
                    //                 res.data.restaurantStatus
                    //             ) {
                    //                 this.restaurantDetail.restaurantStatus =
                    //                     res.data.restaurantStatus;
                    //             }
                    //         },
                    //     });

                    this.getReviews(this.restaurantDetail);

                    if (!this.restaurantDetail) {
                        this.showNotFound = true;
                        return;
                    }
                    // }
                    // if (this.restaurantDetail.restaurantBackgroundImage) {
                    //     this.bannerImage = `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('${this.restaurantDetail.restaurantBackgroundImage}')`;
                    // }
                    // check if device is mobile or desktop
                    if (window.innerWidth < 768) {
                        if (
                            this.restaurantDetail
                                .restaurantBackgroundImageForMobile
                        ) {
                            if (this.greenPalmFlag) {
                                this.bannerImage = `url('${this.restaurantDetail.restaurantBackgroundImageForMobile}')`;
                            } else {
                                this.bannerImage = `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('${this.restaurantDetail.restaurantBackgroundImageForMobile}')`;
                            }
                        }
                    } else {
                        if (this.restaurantDetail.restaurantBackgroundImage) {
                            if (this.greenPalmFlag) {
                                this.bannerImage = `url('${this.restaurantDetail.restaurantBackgroundImage}')`;
                            } else {
                                this.bannerImage = `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('${this.restaurantDetail.restaurantBackgroundImage}')`;
                            }
                        }
                    }

                    this.storeRestaurantInfo(restaurnatUrl);
                    this.restaurantPanelService.restaurantData.next(
                        this.restaurantDetail
                    );

                    this.placeId = this.restaurantDetail.placeId;

                    this.restaurantDetail.cuisine =
                        this.restaurantDetail.cuisine.filter((data) => {
                            if (data.categoryAvailable === false) {
                                return false;
                            } else if (
                                data?.timeAvailable &&
                                this.applyTimeValidation(data)
                            ) {
                                return false;
                            }
                            return true;
                        });

                    for (const cuisine of this.restaurantDetail.cuisine) {
                        cuisine.items = cuisine.items.filter((data) => {
                            if (
                                this.dineInMenuFlag &&
                                (data.dishOrderAvailability === "all" ||
                                    data.dishOrderAvailability === "dineIn")
                            ) {
                                return true;
                            } else if (
                                !this.dineInMenuFlag &&
                                (data.dishOrderAvailability === "all" ||
                                    data.dishOrderAvailability ===
                                        "otherthandinein")
                            ) {
                                return true;
                            }
                            return false;
                        });
                    }

                    // sort the restaurant data cuisine such that offers are shown first
                    this.restaurantDetail.cuisine.sort((a, b) => {
                        if (a?.specialCategory) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    for (const cuisine of this.restaurantDetail.cuisine) {
                        cuisine.items.sort((a, b) => {
                            if (a.categoryPriority && b.categoryPriority) {
                                return a.categoryPriority - b.categoryPriority;
                            } else if (a.categoryPriority) {
                                return -1;
                            } else if (b.categoryPriority) {
                                return 1;
                            } else {
                                if (a.categoryName < b.categoryName) {
                                    return -1;
                                } else if (a.categoryName > b.categoryName) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        });
                    }

                    // sort the dishes with dishpriority for each cuisine
                    // if dishpriority is not present then sort by dishName
                    // lower dishpriority will be shown first

                    for (const cuisine of this.restaurantDetail.cuisine) {
                        cuisine.items.sort((a, b) => {
                            if (a.dishPriority && b.dishPriority) {
                                return a.dishPriority - b.dishPriority;
                            } else if (a.dishPriority) {
                                return -1;
                            } else if (b.dishPriority) {
                                return 1;
                            } else {
                                if (a.dishName < b.dishName) {
                                    return -1;
                                } else if (a.dishName > b.dishName) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        });
                    }

                    // capitalize the first letter of each word in dishName and dishDescription
                    for (const cuisine of this.restaurantDetail.cuisine) {
                        for (const dish of cuisine.items) {
                            try {
                                dish.dishName = this.capitalizeWords(
                                    dish.dishName
                                );
                            } catch (error) {}
                            //
                            //
                            try {
                                dish.dishDescription = this.capitalizeWords(
                                    dish.dishDescription
                                );
                            } catch (error) {}

                            if (dish.addOns && dish.addOns.length > 0) {
                                for (const addOn of dish.addOns) {
                                    try {
                                        addOn.addOnName = this.capitalizeWords(
                                            addOn.addOnName
                                        );
                                    } catch (error) {}
                                }
                            }
                        }
                    }

                    this.restaurantMenuStore = _.clone(
                        this.restaurantDetail.cuisine
                    );
                    this.restaurantMenu = _.clone(
                        this.restaurantDetail.cuisine
                    );

                    // this.googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${this.restaurantDetail?.restaurantName},${this.restaurantDetail?.address?.street},${this.restaurantDetail?.address?.city},${this.restaurantDetail?.address?.state},${this.restaurantDetail?.address?.pinCode}&query_place_id=${this.restaurantDetail?.googlePlaceId}`;

                    this.googleMapUrl = `https://www.google.com/maps?q=${this.restaurantDetail?.address?.latitude},${this.restaurantDetail?.address?.longitude}&ll=${this.restaurantDetail?.address?.latitude},${this.restaurantDetail?.address?.longitude}&z=17`;

                    this.filterRestaurantMenu("all");
                },
            });
        });
    }

    applyTimeValidation(data: any) {
        // here time  be in 24 hours format and in hh:mm format
        if (data && data?.startTime && data?.endTime) {
            const currDate = new Date();
            const startHours = data?.startTime.split(":");
            const endHours = data?.endTime.split(":");
            const tempDate = new Date();
            tempDate.setHours(startHours[0]); // Set hours
            tempDate.setMinutes(startHours[1]); // Set minutes
            const tempDate2 = new Date();
            tempDate2.setHours(endHours[0]); // Set hours
            tempDate2.setMinutes(endHours[1]); // Set minutes

            if (tempDate > tempDate2) {
                if (currDate.getHours() >= 1 && currDate.getHours() <= 7) {
                    currDate.setDate(currDate.getDate() + 1);
                }
                if (currDate < tempDate) {
                    return true;
                }
                tempDate2.setDate(tempDate2.getDate() + 1);
                return false;
            }
            if (currDate < tempDate) {
                return true;
            } else if (currDate > tempDate2) {
                return true;
            }
        }
        return false;
        // get the current time

        // const currDate = new Date();

        // const currHours = currDate.getHours();

        // const currMinutes = currDate.getMinutes();

        // // get the start time and end time
        // if (data && data?.startTime && data?.endTime) {

        // const startTime = data.startTime.split(":");
        // const endTime = data.endTime.split(":");
        // const startHours = parseInt(startTime[0]);
        // const startMinutes = parseInt(startTime[1]);
        // const endHours = parseInt(endTime[0]);
        // const endMinutes = parseInt(endTime[1]);

        // // check if the current time is between the start time and end time

        // // start time can be less than end time or greater than end time

        // // if start time is less than end time

        // if (startHours < endHours) {
        //     if (currHours > startHours && currHours < endHours) {
        //         return true;
        //     } else if (
        //         currHours === startHours &&
        //         currMinutes >= startMinutes
        //     ) {
        //         return true;
        //     } else if (currHours === endHours && currMinutes <= endMinutes) {
        //         return true;
        //     }
        // } else if (startHours > endHours) {
        //     // if start time is greater than end time

        //     if (currHours > startHours || currHours < endHours) {
        //         return true;
        //     } else if (
        //         currHours === startHours &&
        //         currMinutes >= startMinutes
        //     ) {
        //         return true;
        //     } else if (currHours === endHours && currMinutes <= endMinutes) {
        //         return true;
        //     }
        // }}
        // return false;
    }

    checkForPureVeg() {
        if (this.restaurantDetail?.cuisine?.length) {
            for (const data of this.restaurantDetail.cuisine) {
                for (const item of data?.items) {
                    if (item?.dishType !== "veg") {
                        this.pureVegFlag = false;
                    }
                }
            }
        }
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

    // Validate room-customer link and auto-select room
    // NOTE: This method is no longer automatically triggered from URL parameters
    // It can still be called manually if needed
    validateRoomCustomerLink(phoneNumber: string, roomName: string) {
        console.log("[DEBUG] Validating room-customer link with parameters:", {
            phoneNumber,
            roomName,
        });

        console.log("[DEBUG] Using phone+room based validation");
        console.log("[DEBUG] Phone number:", phoneNumber);
        console.log("[DEBUG] Room name:", roomName);

        this.restaurantService
            .validateRoomCustomerLink(phoneNumber, roomName)
            .subscribe({
                next: (res: any) => {
                    console.log(
                        "[DEBUG] Room-customer link validation response:",
                        res
                    );
                    console.log("[DEBUG] Response status:", res?.status);
                    console.log("[DEBUG] Response data:", res?.data);

                    if (res && res.status === "success" && res.data) {
                        console.log(
                            "[DEBUG] Valid phone+room found, auto-selecting room:",
                            res.data.roomName
                        );

                        // Auto-select room service option
                        this.orderOption = "roomService";
                        console.log(
                            "[DEBUG] Set orderOption to:",
                            this.orderOption
                        );

                        // Set user preference with room information
                        this.userPreference = {
                            preference: "room service",
                            value: res.data.roomName,
                            userDetail: {
                                name: "",
                                phoneNumber: res.data.customerPhoneNumber,
                            },
                        };
                        console.log(
                            "[DEBUG] Set userPreference to:",
                            this.userPreference
                        );

                        // Set order option flag to true to indicate selection is complete
                        this.orderOptionFlag = true;
                        console.log(
                            "[DEBUG] Set orderOptionFlag to:",
                            this.orderOptionFlag
                        );

                        // Update cart state
                        this.setCartStateData();
                        console.log("[DEBUG] Cart state updated via service");

                        // Force update of cart state in local storage
                        const cartState = {
                            orderOption: this.orderOption,
                            orderOptionFlag: this.orderOptionFlag,
                            userPreference: this.userPreference,
                            cookingInstruction: this.cookingInstruction,
                        };
                        localStorage.setItem(
                            "cartState",
                            JSON.stringify(cartState)
                        );
                        console.log(
                            "[DEBUG] Cart state saved to localStorage:",
                            cartState
                        );

                        // Show confirmation to user
                        this.utilService.openSnackBar(
                            `Room ${res.data.roomName} automatically selected`,
                            false
                        );
                        console.log(
                            "[DEBUG] Success notification shown to user"
                        );
                    } else {
                        console.error(
                            "[DEBUG] Invalid response format from validation API:",
                            res
                        );
                        console.error("[DEBUG] Response status:", res?.status);
                        console.error("[DEBUG] Response data:", res?.data);
                        console.error("[DEBUG] Response error:", res?.error);

                        this.utilService.openSnackBar(
                            "Could not validate room link. Please select options manually.",
                            true
                        );
                    }
                },
                error: (err) => {
                    console.error(
                        "[DEBUG] Error validating room-customer link:",
                        err
                    );
                    console.error("[DEBUG] Error status:", err?.status);
                    console.error("[DEBUG] Error message:", err?.message);
                    console.error("[DEBUG] Error details:", err?.error);
                    console.error(
                        "[DEBUG] Enhanced error info:",
                        err?.errorInfo
                    );

                    // Show more informative error message to user based on the enhanced error information
                    let errorMessage =
                        "Invalid or expired room link. Please select options manually.";
                    let errorDetails = "";

                    if (err?.errorInfo) {
                        // Use the enhanced error information if available
                        if (err.errorInfo.type === "network") {
                            errorMessage =
                                "Network error: Cannot connect to the server.";

                            // Add specific details based on the API URL
                            if (err.errorInfo.url.includes("localhost")) {
                                errorDetails =
                                    "The local server may not be running. Please contact support.";
                            } else {
                                errorDetails =
                                    "Please check your internet connection and try again.";
                            }

                            // API server connectivity check is disabled
                            // Direct validation fallback is disabled
                            console.log(
                                "[DEBUG] Room-customer link validation is disabled"
                            );
                        } else if (err.errorInfo.type === "not_found") {
                            errorMessage =
                                "The room link validation service is not available.";
                            errorDetails =
                                "Please contact reception for assistance.";
                        } else if (err.errorInfo.type === "auth") {
                            errorMessage =
                                "Authentication error with the room link service.";
                            errorDetails =
                                "Please contact reception for a new link.";
                        } else if (err.errorInfo.type === "server") {
                            errorMessage =
                                "The server encountered an error processing your room link.";
                            errorDetails =
                                "Please try again later or contact reception.";
                        }
                    } else {
                        // Fall back to basic error handling if enhanced info is not available
                        if (err?.status === 404) {
                            errorMessage =
                                "The room link could not be found. It may have been deactivated.";
                        } else if (err?.status === 400) {
                            errorMessage =
                                "The room link is invalid or has expired. Please contact reception for a new link.";
                        } else if (err?.status === 0) {
                            errorMessage =
                                "Network error. Please check your internet connection and try again.";

                            // API server connectivity check is disabled
                            // Direct validation fallback is disabled
                            console.log(
                                "[DEBUG] Room-customer link validation is disabled"
                            );
                        }
                    }

                    // Show the error message to the user
                    this.utilService.openSnackBar(
                        errorMessage + (errorDetails ? " " + errorDetails : ""),
                        true
                    );
                    console.error(
                        "[DEBUG] Error notification shown to user:",
                        errorMessage,
                        errorDetails
                    );
                },
            });
    }
    // Check API server connectivity
    // NOTE: This method is no longer automatically triggered from URL parameters
    // It can still be called manually if needed
    checkApiServerConnectivity() {
        console.log("[DEBUG] Checking API server connectivity...");

        // Make a simple request to the API server to check connectivity
        const pingUrl = `${this.restaurantService.apiUrl}/health`;
        console.log(`[DEBUG] Pinging API server at: ${pingUrl}`);

        // First, check for CORS issues with a preflight check
        this.checkCorsConfiguration(pingUrl)
            .then((corsResult) => {
                console.log(`[DEBUG] CORS check result:`, corsResult);

                if (corsResult.corsEnabled) {
                    console.log(
                        `[DEBUG] CORS is properly configured for the API server`
                    );

                    // Now make the actual health check request
                    return fetch(pingUrl, {
                        method: "GET",
                        mode: "cors",
                        cache: "no-cache",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        // Removed timeout property as it's not supported in RequestInit
                    });
                } else {
                    console.error(
                        `[DEBUG] CORS issue detected: ${corsResult.message}`
                    );
                    // Show a more specific error message to the user
                    this.utilService.openSnackBar(
                        "Network error: The API server is not properly configured for cross-origin requests. Please contact support.",
                        true
                    );
                    return null; // Return null instead of void
                }
            })
            .then((response) => {
                if (!response) {
                    console.log(
                        `[DEBUG] Skipping health check due to CORS issues`
                    );
                    return null; // Return null to indicate no data
                }

                console.log(`[DEBUG] API server ping response:`, response);
                if (response.ok) {
                    console.log(`[DEBUG] API server is reachable`);
                    return response.json();
                } else {
                    console.error(
                        `[DEBUG] API server returned status: ${response.status}`
                    );
                    throw new Error(
                        `API server returned status: ${response.status}`
                    );
                }
            })
            .then((data) => {
                if (!data) {
                    console.log(`[DEBUG] No health check data available`);
                    return; // This is fine as it's the last then in the chain
                }

                console.log(`[DEBUG] API server health data:`, data);
                console.log(
                    `[DEBUG] API server environment:`,
                    data.environment
                );

                // Check for environment mismatch
                const isProduction =
                    this.restaurantService.apiUrl.includes("localhost") ===
                    false;
                const serverIsProduction = data.environment === "production";

                if (isProduction !== serverIsProduction) {
                    console.error(
                        `[DEBUG] Environment mismatch: Client is in ${
                            isProduction ? "production" : "development"
                        } mode but server is in ${
                            serverIsProduction ? "production" : "development"
                        } mode`
                    );
                }
            })
            .catch((error) => {
                console.error(`[DEBUG] API server ping failed:`, error);

                // Check if the error is due to CORS
                if (error.message && error.message.includes("CORS")) {
                    console.error(
                        `[DEBUG] CORS issue detected. The API server may be running but CORS is not configured correctly.`
                    );

                    // Show a more specific error message to the user
                    this.utilService.openSnackBar(
                        "Network error: The API server is not properly configured for cross-origin requests. Please contact support.",
                        true
                    );
                }

                // Check if we're using localhost in production or vice versa
                const isProduction =
                    this.restaurantService.apiUrl.includes("localhost") ===
                    false;
                console.log(
                    `[DEBUG] Environment check - Using production API: ${isProduction}`
                );

                if (isProduction && window.location.hostname === "localhost") {
                    console.error(
                        `[DEBUG] Environment mismatch: Using production API from localhost development environment.`
                    );
                } else if (
                    !isProduction &&
                    window.location.hostname !== "localhost"
                ) {
                    console.error(
                        `[DEBUG] Environment mismatch: Using localhost API from production environment.`
                    );
                }
            });
    }

    // Test the Room-Customer Link validation endpoint directly
    // NOTE: This method is no longer automatically triggered from URL parameters
    // It can still be called manually if needed
    testRoomCustomerLinkEndpoint(phoneNumber: string, roomName: string) {
        console.log(
            "[DEBUG] Testing Room-Customer Link validation endpoint directly..."
        );

        let validationUrl = `${this.restaurantService.apiUrl}/v1/room-customer-link/validate?`;

        // Phone+room based validation
        validationUrl += `phoneNumber=${encodeURIComponent(
            phoneNumber
        )}&roomName=${encodeURIComponent(roomName)}`;
        console.log(
            `[DEBUG] Using phone+room parameters: ${phoneNumber}, ${roomName}`
        );

        console.log(`[DEBUG] Validation URL: ${validationUrl}`);

        // Make a direct fetch request to the validation endpoint
        fetch(validationUrl, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log(`[DEBUG] Direct validation response:`, response);
                console.log(`[DEBUG] Response status:`, response.status);
                console.log(`[DEBUG] Response headers:`, response.headers);

                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(
                        `Validation endpoint returned status: ${response.status}`
                    );
                }
            })
            .then((data) => {
                console.log(`[DEBUG] Validation endpoint data:`, data);

                if (data && data.status === "success" && data.data) {
                    console.log(
                        `[DEBUG] Validation successful for room:`,
                        data.data.roomName
                    );

                    // Show success message
                    this.utilService.openSnackBar(
                        `Direct validation successful for room ${data.data.roomName}`,
                        false
                    );
                } else {
                    console.error(
                        `[DEBUG] Validation response format is invalid:`,
                        data
                    );

                    // Show error message
                    this.utilService.openSnackBar(
                        "Direct validation failed: Invalid response format",
                        true
                    );
                }
            })
            .catch((error) => {
                console.error(`[DEBUG] Direct validation error:`, error);

                // Show error message
                this.utilService.openSnackBar(
                    `Direct validation failed: ${error.message}`,
                    true
                );
            });
    }

    // Check if CORS is properly configured for the API server
    // NOTE: This method is no longer automatically triggered from URL parameters
    // It can still be called manually if needed
    async checkCorsConfiguration(
        url: string
    ): Promise<{ corsEnabled: boolean; message: string }> {
        console.log(`[DEBUG] Checking CORS configuration for: ${url}`);

        try {
            // First try a simple GET request with no-cors mode to check if server is reachable
            console.log(
                `[DEBUG] Testing server reachability with no-cors mode...`
            );
            try {
                const noCorsFetch = await fetch(url, {
                    method: "GET",
                    mode: "no-cors",
                });
                console.log(
                    `[DEBUG] Server is reachable (no-cors):`,
                    noCorsFetch
                );
                console.log(`[DEBUG] Response type:`, noCorsFetch.type);
                // If we get here, the server is at least reachable
            } catch (noCorsFetchError) {
                console.error(
                    `[DEBUG] Server is not reachable even with no-cors mode:`,
                    noCorsFetchError
                );
                return {
                    corsEnabled: false,
                    message: `Server is not reachable at all: ${noCorsFetchError.message}`,
                };
            }

            // Now try a proper CORS preflight request
            console.log(
                `[DEBUG] Testing CORS preflight with OPTIONS request...`
            );
            const response = await fetch(url, {
                method: "OPTIONS",
                mode: "cors",
                headers: {
                    Origin: window.location.origin,
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers":
                        "Content-Type, Authorization",
                },
            });

            console.log(`[DEBUG] CORS preflight response:`, response);
            console.log(`[DEBUG] Response status:`, response.status);
            console.log(`[DEBUG] Response type:`, response.type);

            // Check if the response has the necessary CORS headers
            const allowOrigin = response.headers.get(
                "Access-Control-Allow-Origin"
            );
            const allowMethods = response.headers.get(
                "Access-Control-Allow-Methods"
            );
            const allowHeaders = response.headers.get(
                "Access-Control-Allow-Headers"
            );

            console.log(`[DEBUG] CORS headers:`, {
                "Access-Control-Allow-Origin": allowOrigin,
                "Access-Control-Allow-Methods": allowMethods,
                "Access-Control-Allow-Headers": allowHeaders,
            });

            if (!allowOrigin) {
                return {
                    corsEnabled: false,
                    message:
                        "The API server does not have CORS enabled (missing Access-Control-Allow-Origin header)",
                };
            }

            // Check if our origin is allowed
            if (allowOrigin !== "*" && allowOrigin !== window.location.origin) {
                return {
                    corsEnabled: false,
                    message: `The API server does not allow requests from this origin (${window.location.origin})`,
                };
            }

            // Try a real GET request with CORS mode
            console.log(`[DEBUG] Testing actual GET request with CORS mode...`);
            try {
                const getResponse = await fetch(url, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                console.log(`[DEBUG] GET response:`, getResponse);
                console.log(`[DEBUG] GET response status:`, getResponse.status);
            } catch (getError) {
                console.error(`[DEBUG] GET request failed:`, getError);
                return {
                    corsEnabled: false,
                    message: `CORS preflight succeeded but actual GET request failed: ${getError.message}`,
                };
            }

            return {
                corsEnabled: true,
                message: "CORS is properly configured",
            };
        } catch (error) {
            console.error(`[DEBUG] CORS check failed:`, error);

            return {
                corsEnabled: false,
                message: `CORS check failed: ${error.message}`,
            };
        }
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
            closeOnNavigation: false,
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
                    this.restaurantService.setRestaurantUrl(
                        this.activeRestaurantUrl
                    );
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

        // get the todays day

        const today = new Date().getDay();

        // print the day
        const day = this.allDays[today];

        for (const cuisine of this.restaurantMenuStore) {
            const temp: any = {};

            temp["categoryName"] = cuisine.categoryName;
            temp["specialCategory"] = cuisine.specialCategory;
            temp["_id"] = cuisine._id;
            temp["items"] = [];

            for (let dish of cuisine["items"]) {
                if (
                    (filterValue === "all" || dish.dishType === filterValue) &&
                    dish.dishName.toLowerCase().includes(searchText) &&
                    dish.orderOption !== "none"
                ) {
                    if (dish.days && dish.days.length > 0) {
                        if (dish.days.includes(day)) {
                            result.push(dish);
                        }
                    } else {
                        result.push(dish);
                    }
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

    formatTime(timeObj: {
        hour: number;
        minute: number;
        second: number;
    }): string {
        const { hour, minute, second } = timeObj;
        const formattedHour = hour % 12 || 12; // Convert 0 to 12
        const meridian = hour >= 12 ? "PM" : "AM";
        return `${formattedHour}:${
            minute < 10 ? "0" + minute : minute
        } ${meridian}`;
    }
}
