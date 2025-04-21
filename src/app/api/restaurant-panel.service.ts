import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, of } from "rxjs";
import { environment } from "src/environments/environment";
import { UtilService } from "./util.service";
import { OrderService } from "./order.service";
import { OrderRecievedDialogComponent } from "../angular-material/order-recieved-dialog/order-recieved-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
    providedIn: "root",
})
export class RestaurantPanelService {
    apiUrl = environment.apiUrl;
    restaurantData = new BehaviorSubject({});
    audio: HTMLAudioElement;
    isPlaying: boolean = false;
    constructor(
        private http: HttpClient,
        private utilService: UtilService,
        private orderService: OrderService,
        public dialog: MatDialog
    ) {
        this.audio = new Audio(
            "assets/audio/mixkit-clear-announce-tones-2861.wav"
        ); // Update with your audio file path
        this.audio.muted = true;
        this.audio.onended = () => {
            if (this.isPlaying) {
                this.audio.currentTime = 0;
                this.audio.play();
            }
        };
    }
    private soundTimeout: any; // Property to store the timeout ID

    playSound(flag: boolean) {
        if (flag) {
            if (!this.isPlaying) {
                // Check if it's not already playing
                this.audio.muted = false;
                this.isPlaying = true;

                this.audio.play().catch((err) => {
                    console.log(err);

                    this.showOrderPopUp();
                });

                if (this.soundTimeout) {
                    clearTimeout(this.soundTimeout);
                }

                this.soundTimeout = setTimeout(() => {
                    this.stopSound();
                }, 30000);
            }
        } else {
            this.stopSound();
        }
    }

    stopSound() {
        this.isPlaying = false;
        this.audio.muted = true;
        this.audio.pause();
        this.audio.currentTime = 0;
    }
    generateBill(reqData: any) {
        return this.http.post(
            `${this.apiUrl}/v1/restaurant/generateBill`,
            reqData
        );
    }

    showOrderPopUp() {
        this.dialog.open(OrderRecievedDialogComponent, {
            panelClass: "add-item-dialog",
            disableClose: true,
        });
    }
    playDashboardActionSound() {
        const audioElement = new Audio();
        audioElement.src = "assets/audio/Google Chat - Notification Tone.mp3";
        audioElement.autoplay = true;
    }
    callStatusApi() {
        const reqData = {
            orderStatus: ["pending"],
        };

        this.orderService.getRestaurantOrdersByStatus(reqData).subscribe({
            next: (res: any) => {
                if (
                    res &&
                    res?.data &&
                    res.data &&
                    res.data?.orderData.length
                ) {
                    this.playSound(true);
                }
            },
        });
    }
    setRestaurantData(result?: any) {
        this.getRestaurnatDetail().subscribe({
            next: (res: any) => {
                this.restaurantData.next(res.data.restaurantDetail);
                if (res && res?.data) {
                    this.setRestaurantStatus(
                        res.data.restaurantDetail.restaurantVerified
                    );
                }
                if (result && result.data) {
                    this.utilService.openSnackBar(result.data.message);
                }
            },
        });
    }
    changeRestaurantStatus(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/changeRestaurantStatus`,
            data
        );
    }
    changeDineInStatus(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/updateDineInAvailablity`,
            data
        );
    }
    setRestaurantStatus(data) {
        sessionStorage.setItem("restaurantVerified", data);
    }
    getRestaurantStatus() {
        return sessionStorage.getItem("restaurantVerified");
    }
    getRestaurnatDetail() {
        return this.http.get(`${this.apiUrl}/v1/restaurant/restaurantDetail`);
    }
    updateRestaurantDetail(restaurantData: any) {
        return this.http.post(
            `${this.apiUrl}/v1/restaurant/restaurantDetail`,
            restaurantData
        );
    }
    updatePaymentGateway(data: any) {
        return this.http.post(
            `${this.apiUrl}/v1/admin/updatePaymentGateway`,
            data
        );
    }

    updateStoreSettings(gstData: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/updateStoreSettings`,
            gstData
        );
    }
    updateRestaurantCashOnDelivery(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/updateRestaurantCashOnDelivery`,
            data
        );
    }
    updateRestaurantByPassAuth(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/updateRestaurantByPassAuth`,
            data
        );
    }
    updateRestaurantAutoReject(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/updateRestaurantAutoReject`,
            data
        );
    }
    updateRestaurantDineInGstSetting(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/updateRestaurantDineInGstSetting`,
            data
        );
    }
    updateContactDetail(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/updateContactDetail`,
            data
        );
    }
    addContactDetails(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/addContactDetail`,
            data
        );
    }
    deleteTableById(id: string) {
        return this.http.delete(
            `${this.apiUrl}/v1/restaurant/deleteTableById/${id}`
        );
    }
    deleteRoomById(id: string) {
        return this.http.delete(
            `${this.apiUrl}/v1/restaurant/deleteRoomById/${id}`
        );
    }
    deleteContactDetail(id: string) {
        return this.http.delete(
            `${this.apiUrl}/v1/restaurant/deleteContactDetail/${id}`
        );
    }
    getContactDetailById(id: string) {
        return this.http.get(
            `${this.apiUrl}/v1/restaurant/getContactDetailById/${id}`
        );
    }
    updateRestaurantBackgoundImage(imageData: { image: any }) {
        return this.http.put(
            `${this.apiUrl}/v1/restaurant/updateImage`,
            imageData
        );
    }
    updateRestaurantBannerImageForMobile(imageData: { image: any }) {
        return this.http.put(
            `${this.apiUrl}/v1/restaurant/updateRestaurantBannerImageForMobile`,
            imageData
        );
    }
    updateRestaurantBannerImageForSmall(imageData: { image: any }) {
        return this.http.put(
            `${this.apiUrl}/v1/restaurant/updateRestaurantBannerImageForSmall`,
            imageData
        );
    }

    createTableEntry(data: any) {
        return this.http.post(
            `${this.apiUrl}/v1/restaurant/createTableEntry`,
            data
        );
    }
    createRoomEntry(data: any) {
        return this.http.post(
            `${this.apiUrl}/v1/restaurant/createRoomEntry`,
            data
        );
    }
    updateTable(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/editTableById`,
            data
        );
    }
    updateRoom(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/editRoomById`,
            data
        );
    }
    getAllTables() {
        return this.http.get(`${this.apiUrl}/v1/restaurant/getAllTables`);
    }
    getAllRooms() {
        return this.http.get(`${this.apiUrl}/v1/restaurant/getAllRooms`);
    }

    updateRestaurantImage(imageData: { image: any }) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/updateRestaurantImage`,
            imageData
        );
    }

    deleteRestaurantImage(imageData: { image: any }) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/deleteRestaurantImage`,
            imageData
        );
    }
    getResataurantOrder() {
        return this.http.get("assets/data/comapny.json");
    }
    updatePlaceId(data) {
        return this.http.patch(`${this.apiUrl}/v1/restaurant/placeId`, data);
    }
    addExtraIngredient(data: any) {
        return this.http.post(
            `${this.apiUrl}/v1/restaurant/dishes/extraIngredents`,
            data
        );
    }
    editExtraIngredient(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/dishes/extraIngredents/edit`,
            data
        );
    }
    deleteExtraIngredient(id: string) {
        return this.http.delete(
            `${this.apiUrl}/v1/restaurant/dishes/extraIngredents/delete/${id}`
        );
    }
    addDish(data: any) {
        return this.http.post(
            `${this.apiUrl}/v1/restaurant/dishes/addDish`,
            data
        );
    }
    editDish(data: any) {
        return this.http.put(
            `${this.apiUrl}/v1/restaurant/dishes/editDish`,
            data
        );
    }
    deleteDish(id: string, data: any) {
        return this.http.put(
            `${this.apiUrl}/v1/restaurant/dishes/deleteDish/${id}`,
            data
        );
    }
    addVariantsToDish(data: any) {
        return this.http.put(
            `${this.apiUrl}/v1/restaurant/dishes/addVariants`,
            data
        );
    }
    addCategory(reqBody) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/dishes/addCategory`,
            reqBody
        );
    }
    updateCategory(reqData: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/dishes/editCategory`,
            reqData
        );
    }
    getCategory() {
        return this.http.get(`${this.apiUrl}/v1/restaurant/dishes/getCategory`);
    }
    addAddons(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/dishes/addAddons`,
            data
        );
    }
    addDishChoices(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/dishes/addDishChoices`,
            data
        );
    }
    editDishChoices(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/dishes/editDishChoices`,
            data
        );
    }
    editAddons(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/dishes/editAddons`,
            data
        );
    }
    deleteAddons(id: string) {
        return this.http.delete(
            `${this.apiUrl}/v1/restaurant/dishes/deleteAddons/${id}`
        );
    }
    deleteCategory(id: string) {
        return this.http.delete(
            `${this.apiUrl}/v1/restaurant/dishes/deleteCategory/${id}`
        );
    }
    deleteChoices(id: string) {
        return this.http.delete(
            `${this.apiUrl}/v1/restaurant/dishes/deleteChoices/${id}`
        );
    }
    setSelectedDish(data) {
        sessionStorage.setItem("dishDetail", JSON.stringify(data));
    }
    getSelectedDish() {
        const data = sessionStorage.getItem("dishDetail");
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }
    getIndianStates() {
        let indianStates = [
            "Andhra Pradesh",
            "Arunachal Pradesh",
            "Assam",
            "Bihar",
            "Chhattisgarh",
            "Goa",
            "Gujarat",
            "Haryana",
            "Himachal Pradesh",
            "Jharkhand",
            "Karnataka",
            "Kerala",
            "Madhya Pradesh",
            "Maharashtra",
            "Manipur",
            "Meghalaya",
            "Mizoram",
            "Nagaland",
            "Odisha",
            "Punjab",
            "Rajasthan",
            "Sikkim",
            "Tamil Nadu",
            "Telangana",
            "Tripura",
            "Uttar Pradesh",
            "Uttarakhand",
            "West Bengal",
            "Andaman and Nicobar Islands",
            "Chandigarh",
            "Dadra and Nagar Haveli and Daman and Diu",
            "Delhi",
            "Ladakh",
            "Lakshadweep",
            "Puducherry",
        ];

        return indianStates;
    }

    //This function returns a list of customers from the API
    getCustomerList() {
        //Make a GET request to the API endpoint for getting the customer list
        return this.http.get(`${this.apiUrl}/v1/restaurant/getCustomerList`);
    }

    addPromoCode(data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/addPromoCode`,
            data
        );
    }

    getPromoCode() {
        return this.http.get(`${this.apiUrl}/v1/restaurant/getPromoCode`);
    }

    // Add these methods to your RestaurantPanelService
    toggleLoyalOrBlockStatus(
        LoyalOrBlock: string,
        customerId: string,
        isLoyal: boolean
    ) {
        let url = `/v1/restaurant/${LoyalOrBlock}/${
            isLoyal ? "add" : "remove"
        }/`;

        const data = {
            customerId: customerId,
        };

        return this.http.patch(`${this.apiUrl}${url}`, data);
    }

    // Waiter call methods
    getWaiterCalls() {
        console.log("getWaiterCalls called"); // Debugging line
        // Add a timestamp parameter to prevent caching
        const timestamp = new Date().getTime();
        // Make a GET request to the API endpoint for getting waiter calls with cache busting
        return this.http.get(
            `${this.apiUrl}/v1/waiter/getWaiterCalls?_t=${timestamp}`
        );
    }

    updateWaiterCallStatus(data: any) {
        console.log(
            "Restaurant service sending updateWaiterCallStatus request with data:",
            data
        );
        // Add a timestamp parameter to prevent caching
        const timestamp = new Date().getTime();
        // Use the public endpoint for testing
        return this.http.post(
            `${this.apiUrl}/v1/waiter/updateStatusPublic?_t=${timestamp}`,
            data
        );
    }
}
