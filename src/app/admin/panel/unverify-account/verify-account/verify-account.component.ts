import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/api/authentication.service";

import { UtilService } from "src/app/api/util.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminPanelService } from "src/app/api/admin-panel.service";
import { EmailDialogComponent } from "./email-dialog/email-dialog.component";
import { AddAddressMapComponent } from "src/app/restaurant/component/restaurant-menu/address/add-address-map/add-address-map.component";
import { GoogleMapsService } from "src/app/api/googlemaps.service";

@Component({
    selector: "app-verify-account",
    templateUrl: "./verify-account.component.html",
    styleUrls: ["./verify-account.component.scss"],
})
export class VerifyAccountComponent implements OnInit {
    indianStates = [];
    editFlag = false;
    emailVerified = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    restaurantForm: FormGroup;

    restaurantVerified = false;
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
    id: any;
    constructor(
        private authService: AuthenticationService,
        private utilService: UtilService,
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private adminService: AdminPanelService,
        private router: Router,
        private googleMapsService: GoogleMapsService
    ) {}

    ngOnInit(): void {
        this.assignIndianState();
        this.generateRestaurantForm();
    }
    generateRestaurantForm() {
        this.restaurantForm = this.fb.group({
            restaurantName: ["", [Validators.required]],
            restaurantEmail: ["", [Validators.required, Validators.email]],
            restaurantType: ["", [Validators.required]],
            restaurantPhoneNumber: ["", [Validators.required]],
            restaurantVerified: ["", [Validators.required]],
            gstNumber: [""],
            fssaiLicenseNumber: ["", [Validators.required]],
            restaurantUrl: ["", [Validators.required]],
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
    }
    getRestaurantDetail() {
        this.route.params.subscribe((res) => {
            this.id = res["id"];
            this.adminService.getAdminRestaurantData(this.id).subscribe({
                next: (res: any) => {
                    if (res.data.restaurantDetail) {
                        const responseData = res.data.restaurantDetail;
                        console.log("responseData", responseData);
                        this.emailVerified = responseData.emailVerified;
                        this.restaurantForm.patchValue(responseData);
                        this.restaurantVerified =
                            responseData.restaurantVerified;

                        console.log("restaurantForm", this.restaurantForm);
                        console.log(
                            "restaurantVerified",
                            this.restaurantVerified
                        );
                    }
                },
            });
        });
    }

    editRestaurant() {
        if (!this.editFlag) {
            this.adminService
                .editRestaurant(this.id, this.restaurantForm.value)
                .subscribe({
                    next: (res: any) => {
                        this.utilService.openSnackBar(
                            "Restaurant Updated Successfully"
                        );
                        this.getRestaurantDetail();
                        return res;
                    },
                });
        }
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
    sendEmailToRestaurant() {
        const dialogRef = this.dialog.open(EmailDialogComponent, {
            // to make EmailDialogComponent run the ng g c email-dialog
            disableClose: true,

            data: {
                restaurantEmail:
                    this.restaurantForm.get("restaurantEmail").value,
                subject: "",

                message: "",
            },
        });

        dialogRef.afterClosed().subscribe((message) => {
            if (message && message.length > 0) {
                const data = {
                    restaurantEmail:
                        this.restaurantForm.get("restaurantEmail").value,
                    subject: "Email from Digital Menu",
                    message: message,
                };

                this.adminService.sendEmailToRestaurant(data).subscribe({
                    next: (res) => {
                        this.utilService.openSnackBar(
                            "Email sent successfully"
                        );
                    },
                });
            }
        });
    }

    viewAllUsers() {
        this.router.navigate(["/admin/view-users", this.id]);
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

    assignIndianState() {
        this.indianStates = this.restaurantService.getIndianStates();
    }
    verifyDetail() {
        // load the restaurant detail
        this.route.params.subscribe((res) => {
            this.id = res["id"];
            this.adminService.getAdminRestaurantData(this.id).subscribe({
                next: (res: any) => {
                    if (res.data.restaurantDetail) {
                        const responseData = res.data.restaurantDetail;
                        console.log("responseData", responseData);
                        this.emailVerified = responseData.emailVerified;
                        this.restaurantForm.patchValue(responseData);
                        this.restaurantVerified =
                            responseData.restaurantVerified;

                        console.log("restaurantForm", this.restaurantForm);
                        console.log(
                            "restaurantVerified",
                            this.restaurantVerified
                        );
                    }
                    if (
                        this.restaurantForm.get("restaurantUrl").value &&
                        this.restaurantForm.get("restaurantUrl").value.length >
                            0
                    ) {
                        const data = {
                            restaurantVerified: !this.restaurantVerified,
                        };
                        this.adminService
                            .changeRestaurantStatus(this.id, data)
                            .subscribe({
                                next: (res) => {
                                    console.log(res);
                                    this.restaurantVerified =
                                        !this.restaurantVerified;
                                    // show the success message if the restaurant is verified successfully
                                    if (this.restaurantVerified) {
                                        this.utilService.openSnackBar(
                                            "Restaurant Verified Successfully"
                                        );
                                    } else {
                                        this.utilService.openSnackBar(
                                            "Restaurant Disabled Successfully"
                                        );
                                    }

                                    // send the email to the restaurant

                                    if (this.restaurantVerified) {
                                        const data = {
                                            restaurantEmail:
                                                this.restaurantForm.get(
                                                    "restaurantEmail"
                                                ).value,
                                            subject:
                                                "Your restaurant is verified by the digital menu",
                                            message:
                                                "Your restaurant is verified by the admin. Now you can login to your account and start using the Digital Menu",
                                        };

                                        this.adminService
                                            .sendEmailToRestaurant(data)
                                            .subscribe({
                                                next: (res) => {
                                                    console.log(res);
                                                },
                                            });
                                    } else {
                                        const data = {
                                            restaurantEmail:
                                                this.restaurantForm.get(
                                                    "restaurantEmail"
                                                ).value,

                                            subject:
                                                "Your restaurant is disabled by the digital menu",
                                            message:
                                                "Your restaurant is disabled by the admin. Please contact the admin for more details",
                                        };

                                        this.adminService
                                            .sendEmailToRestaurant(data)
                                            .subscribe({
                                                next: (res) => {
                                                    console.log(res);
                                                },
                                            });
                                    }

                                    return;
                                },
                            });
                    } else {
                        this.utilService.openSnackBar(
                            "The restaurant URL is not valid. Please save the restaurant URL first",
                            true
                        );
                    }
                },
            });
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
