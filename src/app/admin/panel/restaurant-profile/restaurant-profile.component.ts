// restaurant-profile.component.ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/api/authentication.service";
import { EmailOtpComponent } from "./email-otp/email-otp.component";
import { UtilService } from "src/app/api/util.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { AddAddressMapComponent } from "src/app/restaurant/component/restaurant-menu/address/add-address-map/add-address-map.component";
import { GoogleMapsService } from "src/app/api/googlemaps.service";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-restaurant-profile",
    templateUrl: "./restaurant-profile.component.html",
    styleUrls: ["./restaurant-profile.component.scss"],
})
export class RestaurantProfileComponent implements OnInit, OnDestroy {
    indianStates = [];
    editFlag = false;
    emailVerified = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    restaurantForm: FormGroup;
    restaurantType = [
        "Pizza",
        "Biryani",
        "Ice Cream",
        "Mithai",
        "Fast Food",
        "North Indian",
        "Chinese",
        "Healthy Food",
        "Cake",
        "South Indian",
        "Rolls",
        "Coffee & Tea",
        "Burger",
        "Other",
    ];
    constructor(
        private authService: AuthenticationService,
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService,
        private fb: FormBuilder,
        private googleMapsService: GoogleMapsService
    ) {}

    ngOnInit(): void {
        this.assignIndianState();
        this.generateRestaurantForm();
    }
    generateRestaurantForm() {
        this.restaurantForm = this.fb.group({
            restaurantName: ["", [Validators.required]],
            restaurantType: ["", [Validators.required]],
            restaurantPhoneNumber: [
                "",
                [Validators.required, Validators.pattern(/^\d{10}$/)],
            ],
            gstNumber: [""],
            fssaiLicenseNumber: ["", [Validators.required]],
            restaurantEmail: ["", [Validators.required, Validators.email]], // Updated form control name
            address: this.fb.group({
                street: ["", [Validators.required]],
                city: ["", [Validators.required]],
                state: ["", [Validators.required]],
                pinCode: ["", [Validators.required]],
                latitude: ["", [Validators.required]],
                longitude: ["", [Validators.required]],
                landmark: [""],
            }),
        });
        this.getRestaurantDetail();
        // this.restaurantForm.disable();
    }

    getRestaurantDetail() {
        this.restaurantService.restaurantData
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.emailVerified = res.emailVerified;
                    this.restaurantForm.patchValue(res);
                },
            });
    }
    
    submitForm() {
        const data = this.restaurantForm.value;
        this.restaurantService.updateRestaurantDetail(data).subscribe({
            next: (res: any) => {
                this.restaurantService.setRestaurantData(this.restaurantType);
                this.generateRestaurantForm();
                this.openConfirmModal(res);
            },
        });
    }
    openConfirmModal(res) {
        const dialogData = {
            title: "Confirm",
            message: res.data?.message,
        };
        this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            disableClose: true,
        });
    }
    enableForm() {
        this.editFlag = false;
        this.restaurantForm.enable();
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.restaurantForm.get(fieldName).errors &&
            this.restaurantForm.get(fieldName).errors[errorString] &&
            (this.restaurantForm.get(fieldName).dirty ||
                this.restaurantForm.get(fieldName).touched)
        );
    }
    checkForErrorAddress(fieldName: string, errorString: string) {
        return (
            this.restaurantForm.get("address").get(fieldName).errors &&
            this.restaurantForm.get("address").get(fieldName).errors[
                errorString
            ] &&
            (this.restaurantForm.get("address").get(fieldName).dirty ||
                this.restaurantForm.get("address").get(fieldName).touched)
        );
    }

    startEmailVerification() {
        this.restaurantForm.markAllAsTouched();
        if (!this.restaurantForm.valid) {
            console.log("Invalid Form");
            return;
        }

        const restaurantEmail =
            this.restaurantForm.get("restaurantEmail").value;

        this.authService.sendEmailVerificationOtp(restaurantEmail).subscribe({
            next: (res: any) => {
                let dialogRef = this.dialog.open(EmailOtpComponent, {
                    disableClose: true,
                    data: {
                        restaurantEmail: restaurantEmail,
                    },
                    panelClass: "app-full-bleed-dialog",
                });

                dialogRef.afterClosed().subscribe((result) => {
                    this.emailVerified = result?.flag ? true : false;
                    if (result?.flag) {
                        this.submitForm();
                    }
                });
            },
        });
    }

    openAddAddressDialog() {
        const dialogRef = this.dialog.open(AddAddressMapComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
            data: {
                showCompleteAddressButton: false,
            },
        });

        dialogRef.afterClosed().subscribe((markerPosition) => {
            if (markerPosition) {
                // Handle the latitude and longitude (Add logic to save the latitude and longitude)
                console.log("Marker Position: ", markerPosition);
                this.googleMapsService
                    .getPinCodeFromGeocode(
                        markerPosition.lat,
                        markerPosition.lng
                    )
                    .subscribe((pinCode) => {
                        console.log("Pin Code:", pinCode);
                        this.restaurantForm.patchValue({
                            address: {
                                latitude: markerPosition.lat,
                                longitude: markerPosition.lng,
                                pinCode: pinCode,
                            },
                        });
                    });
            }
        });
    }

    // Send the latitude and longitude to the API to save

    assignIndianState() {
        this.indianStates = this.restaurantService.getIndianStates();
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
