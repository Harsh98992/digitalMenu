import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestaurantService } from "../../api/restaurant.service";
import { OrderAcceptDialogComponent } from "src/app/angular-material/order-accept-dialog/order-accept-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-track-order",
    templateUrl: "./track-order.component.html",
    styleUrls: ["./track-order.component.scss"],
})
export class TrackOrderComponent implements OnInit {
    trackingForm: FormGroup;
    userForm: FormGroup;
    restaurantData = [];
    currentRoomData = [];
    constructor(
        private fb: FormBuilder,
        private restaurantService: RestaurantService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.trackingForm = this.fb.group({
            trackingId: ["", Validators.required],
        });
        this.userForm = this.fb.group({
            restaurantName: ["", Validators.required],
            roomNumber: ["", Validators.required],
            customerName: ["", Validators.required],
        });
        this.getRestaurantWithRoom();
    }
    getRestaurantWithRoom() {
        this.restaurantService.getRestaurantWithRoomService().subscribe({
            next: (res) => {
                if (res["data"] && res["data"]["restaurantData"]) {
                    this.restaurantData = res["data"]["restaurantData"];
                }
            },
        });
    }
    changeRoomNo() {
        const val = this.userForm.get("restaurantName").value;
        if (val) {
            this.currentRoomData = val?.room ?? [];
        } else {
            this.currentRoomData = [];
        }
    }
    toggleSignup() {
        document.getElementById("login-toggle").style.backgroundColor = "#fff";
        document.getElementById("login-toggle").style.color = "#222";
        document.getElementById("signup-toggle").style.backgroundColor =
            "#57b846";
        document.getElementById("signup-toggle").style.color = "#fff";
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "block";
    }

    toggleLogin() {
        document.getElementById("login-toggle").style.backgroundColor =
            "#57B846";
        document.getElementById("login-toggle").style.color = "#fff";
        document.getElementById("signup-toggle").style.backgroundColor = "#fff";
        document.getElementById("signup-toggle").style.color = "#222";
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    }
    searchByTrackingId() {
        this.trackingForm.markAllAsTouched();

        if (this.trackingForm.valid) {
            const trackingId = this.trackingForm.get("trackingId").value;
            // Handle form submission, e.g., send trackingId to a server
            this.restaurantService.getOrderwithOrderId(trackingId).subscribe({
                next: (res) => {
                    if (res && res["data"]?.["orderData"]?._id) {
                        const orderSummary = res["data"]["orderData"];
                        this.showOrderDetails(orderSummary);
                    } else {
                    }
                },
            });
        }
    }
    searchByName() {
        this.userForm.markAllAsTouched();
        if (this.userForm.valid) {
            const reqData = {
                restaurnatId:
                    this.userForm.get("restaurantName").value?.restaurantId
                        ?._id,
                roomName: this.userForm.get("roomNumber").value,
                customerName: this.userForm.get("customerName").value,
            };
            this.restaurantService
                .getOrderwithRestaurantNameCustomerNameRoomName(reqData)
                .subscribe({
                    next: (res) => {
                        if (res && res["data"]?.["orderData"]?._id) {
                            const orderSummary = res["data"]["orderData"];
                            this.showOrderDetails(orderSummary);
                        } else {
                        }
                    },
                });
        }
    }
    showOrderDetails(orderSummary: any) {
        const dialogData = {
            ...orderSummary,
            customerMode: true,
            completeScreen: true,
            roomScreenFlag: true,
        };

        this.dialog.open(OrderAcceptDialogComponent, {
            minWidth: "90vw",
            data: dialogData,
        });
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.trackingForm.get(fieldName).errors &&
            this.trackingForm.get(fieldName).errors[errorString] &&
            (this.trackingForm.get(fieldName).dirty ||
                this.trackingForm.get(fieldName).touched)
        );
    }
    checkForUserFormError(fieldName: string, errorString: string) {
        return (
            this.userForm.get(fieldName).errors &&
            this.userForm.get(fieldName).errors[errorString] &&
            (this.userForm.get(fieldName).dirty ||
                this.userForm.get(fieldName).touched)
        );
    }
}
