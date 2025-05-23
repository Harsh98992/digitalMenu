import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-store",
    templateUrl: "./store.component.html",
    styleUrls: ["./store.component.scss"],
})
export class StoreComponent implements OnInit {
    gstForm: FormGroup;
    gstDineInForm: FormGroup;
    bypassForm: FormGroup;
    isEditing: boolean = false;
    isEditingCashOnDelivery = false;
    googleReviewForm: FormGroup;
    cashOnDeliveryForm: FormGroup;
    isEditingGoogleReview: boolean = false;

    deliveryForm: FormGroup;
    isEditingDelivery: boolean = false;

    socialMediaForm: FormGroup;
    isEditingSocialMedia: boolean = false;

    availabilityForm: FormGroup;
    isEditingAvailability: boolean = false;
    isEditingByPassAuth: any;
    isEditingAutoReject: any;
    isEditingDineIn;
    autoRejectForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private restaurantPanelService: RestaurantPanelService,
        private utilService: UtilService
    ) {}

    ngOnInit() {
        // GST Setting Form
        // this.gstForm = this.formBuilder.group({
        //     isPricingInclusiveOfGST: [true],
        //     customGSTPercentage: [5],
        // });

        // both are either true or false and not empty
        this.gstForm = this.formBuilder.group({
            isPricingInclusiveOfGST: [true],
            customGSTPercentage: [5],
            isGstApplicable: [false],
        });
        this.gstDineInForm = this.formBuilder.group({
            isDineInPricingInclusiveOfGST: [true],
            customDineInGSTPercentage: [5],
            isDineInGstApplicable: [false],
        });
        this.cashOnDeliveryForm = this.formBuilder.group({
            cashOnDelivery: [true],
        });
        this.bypassForm = this.formBuilder.group({
            byPassAuth: [false],
        });
        this.autoRejectForm = this.formBuilder.group({
            autoRejectFlag: [true],
        });

        this.getGSTFormDetails();

        this.gstForm.disable();
        this.bypassForm.disable();
        this.autoRejectForm.disable();
        this.cashOnDeliveryForm.disable();
        this.gstDineInForm.disable();
        // Google Review Setting Form
        this.googleReviewForm = this.formBuilder.group({
            showGoogleReview: [true],
            placeId: [""],
        });

        this.getGoogleReviewFormDetails();

        this.googleReviewForm.get("placeId").disable();
        // this.googleReviewForm.get("showGoogleReview").disable();

        // Delivery Setting Form
        this.deliveryForm = this.formBuilder.group({
            provideDelivery: [false],
            maxDeliveryDistance: [0],
            minOrderValueForFreeDelivery: [0],
            deliveryFeeBelowMinValue: [0],
            minOrderValueForDelivery: [0],
        });

        this.getDeliveryFormDetails();

        this.deliveryForm.get("maxDeliveryDistance").disable();
        this.deliveryForm.get("minOrderValueForFreeDelivery").disable();
        this.deliveryForm.get("deliveryFeeBelowMinValue").disable();
        this.deliveryForm.get("provideDelivery").disable();
        this.deliveryForm.get("minOrderValueForDelivery").disable();

        // Social Media Setting Form
        this.socialMediaForm = this.formBuilder.group({
            facebookUrl: [""],

            instagramUrl: [""],

            youtubeUrl: [""],
        });

        this.getSocialMediaFormDetails();

        this.socialMediaForm.get("facebookUrl").disable();

        this.socialMediaForm.get("instagramUrl").disable();

        this.socialMediaForm.get("youtubeUrl").disable();

        // Availability Setting Form
        this.availabilityForm = this.formBuilder.group({
            openTime: [, Validators.required],
            closeTime: [, Validators.required],
            openDays: [
                [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                Validators.required,
            ],
        });

        this.getAvailabilityFormDetails();

        this.availabilityForm.get("openTime").disable();
        this.availabilityForm.get("closeTime").disable();
        this.availabilityForm.get("openDays").disable();
    }

    // GST Setting Functions

    getGSTFormDetails() {
        this.restaurantPanelService.getRestaurnatDetail().subscribe((res) => {
            console.log(res["data"]["restaurantDetail"]);

            this.cashOnDeliveryForm.patchValue({
                cashOnDelivery:
                    res["data"]["restaurantDetail"]["provideCashOnDelivery"],
            });
            this.bypassForm.patchValue({
                byPassAuth: res["data"]["restaurantDetail"]["byPassAuth"],
            });
            this.autoRejectForm.patchValue({
                autoRejectFlag:
                    res["data"]["restaurantDetail"]["autoRejectFlag"] ?? true,
            });

            this.gstForm.patchValue({
                isPricingInclusiveOfGST:
                    res["data"]["restaurantDetail"]["isPricingInclusiveOfGST"],
                customGSTPercentage:
                    res["data"]["restaurantDetail"]["customGSTPercentage"] === 0
                        ? 5
                        : res["data"]["restaurantDetail"][
                              "customGSTPercentage"
                          ],
                isGstApplicable:
                    res["data"]["restaurantDetail"]["isGstApplicable"],
            });
            this.gstDineInForm.patchValue({
                isDineInPricingInclusiveOfGST:
                    res["data"]["restaurantDetail"][
                        "isDineInPricingInclusiveOfGST"
                    ],
                customDineInGSTPercentage:
                    res["data"]["restaurantDetail"][
                        "customDineInGSTPercentage"
                    ] === 0
                        ? 5
                        : res["data"]["restaurantDetail"][
                              "customDineInGSTPercentage"
                          ],
                isDineInGstApplicable:
                    res["data"]["restaurantDetail"]["isDineInGstApplicable"],
            });
        });
    }

    toggleEditMode() {
        if (!this.isEditing) {
            this.gstForm.enable();
            this.isEditing = !this.isEditing;
        } else {
            this.updateRestaurantData();
        }
    }
    toggleEditModeDineIn() {
        if (!this.isEditingDineIn) {
            this.gstDineInForm.enable();
            this.isEditingDineIn = !this.isEditingDineIn;
        } else {
            this.updateDineInGst();
        }
    }
    updateDineInGst() {
        const reqData = Object.assign({}, this.gstDineInForm.value);
        if (!reqData.isDineInGstApplicable) {
            reqData.isDineInPricingInclusiveOfGST = false;
            reqData.customDineInGSTPercentage = 0;
        }

        this.restaurantPanelService
            .updateRestaurantDineInGstSetting(reqData)
            .subscribe((res) => {
                console.log(res);

                this.getGSTFormDetails();
                this.gstDineInForm.disable();

                this.utilService.openSnackBar(
                    "Dine In GST Details updated successfully"
                );
                this.isEditingDineIn = !this.isEditingDineIn;
            });
    }
    toggleAuthorization() {
        if (!this.isEditingByPassAuth) {
            this.bypassForm.enable();
            this.isEditingByPassAuth = !this.isEditingByPassAuth;
        } else {
            this.updateBypassAuth();
        }
    }
    toggleAutoReject() {
        if (!this.isEditingAutoReject) {
            this.autoRejectForm.enable();
            this.isEditingAutoReject = !this.isEditingAutoReject;
        } else {
            this.updateAutoRejectValue();
        }
    }
    updateAutoRejectValue() {
        const reqData = {
            autoRejectFlag: this.autoRejectForm.value.autoRejectFlag ?? false,
        };
        this.restaurantPanelService
            .updateRestaurantAutoReject(reqData)
            .subscribe({
                next: (res) => {
                    console.log(res);

                    // Add a small delay to ensure the database update has completed
                    setTimeout(() => {
                        this.getGSTFormDetails();
                    }, 300);

                    this.autoRejectForm.disable();

                    this.utilService.openSnackBar(
                        "Auto Reject setting updated successfully"
                    );
                    this.isEditingAutoReject = !this.isEditingAutoReject;
                },
                error: (err) => {
                    console.error("Error updating Auto Reject setting:", err);
                    this.utilService.openSnackBar(
                        "Failed to update Auto Reject setting. Please try again.",
                        true
                    );
                },
            });
    }
    updateBypassAuth() {
        const reqData = {
            byPassAuth: this.bypassForm.value.byPassAuth ?? false,
        };
        this.restaurantPanelService
            .updateRestaurantByPassAuth(reqData)
            .subscribe({
                next: (res) => {
                    console.log(res);

                    // Add a small delay to ensure the database update has completed
                    setTimeout(() => {
                        this.getGSTFormDetails();
                    }, 300);

                    this.bypassForm.disable();

                    this.utilService.openSnackBar(
                        "Bypass Authentication setting updated successfully"
                    );
                    this.isEditingByPassAuth = !this.isEditingByPassAuth;
                },
                error: (err) => {
                    console.error(
                        "Error updating Bypass Authentication setting:",
                        err
                    );
                    this.utilService.openSnackBar(
                        "Failed to update Bypass Authentication setting. Please try again.",
                        true
                    );
                },
            });
    }
    toggleCashOnDeliveryEditMode() {
        if (!this.isEditingCashOnDelivery) {
            this.cashOnDeliveryForm.enable();
            this.isEditingCashOnDelivery = !this.isEditingCashOnDelivery;
        } else {
            this.updateCashOnDelivery();
        }
    }
    updateCashOnDelivery() {
        const reqData = {
            cashOnDelivery:
                this.cashOnDeliveryForm.value.cashOnDelivery ?? false,
        };
        this.restaurantPanelService
            .updateRestaurantCashOnDelivery(reqData)
            .subscribe({
                next: (res) => {
                    console.log(res);

                    // Add a small delay to ensure the database update has completed
                    setTimeout(() => {
                        this.getGSTFormDetails();
                    }, 300);

                    this.cashOnDeliveryForm.disable();

                    this.utilService.openSnackBar(
                        "Cash On Delivery setting updated successfully"
                    );
                    this.isEditingCashOnDelivery =
                        !this.isEditingCashOnDelivery;
                },
                error: (err) => {
                    console.error(
                        "Error updating Cash On Delivery setting:",
                        err
                    );
                    this.utilService.openSnackBar(
                        "Failed to update Cash On Delivery setting. Please try again.",
                        true
                    );
                },
            });
    }

    updateRestaurantData() {
        const reqData = Object.assign({}, this.gstForm.value);
        if (!reqData.isGstApplicable) {
            reqData.isPricingInclusiveOfGST = false;
            reqData.customGSTPercentage = 0;
        }

        this.restaurantPanelService
            .updateStoreSettings(reqData)
            .subscribe((res) => {
                console.log(res);

                this.getGSTFormDetails();
                this.gstForm.disable();

                this.utilService.openSnackBar(
                    "GST Details updated successfully"
                );
                this.isEditing = !this.isEditing;
            });
    }

    // Google Review Setting Functions

    getGoogleReviewFormDetails() {
        this.restaurantPanelService.getRestaurnatDetail().subscribe((res) => {
            this.googleReviewForm.patchValue({
                showGoogleReview:
                    res["data"]["restaurantDetail"]["showGoogleReview"],
                placeId: res["data"]["restaurantDetail"]["placeId"],
            });
        });
    }

    toggleGoogleReviewEditMode() {
        if (!this.isEditingGoogleReview) {
            // this.googleReviewForm.get("showGoogleReview").enable();
            this.googleReviewForm.get("placeId").enable();
            this.isEditingGoogleReview = !this.isEditingGoogleReview;
        } else {
            this.updateGoogleReviewData();
        }
    }

    updateGoogleReviewData() {
        const data = {
            placeId: this.googleReviewForm.value.placeId,
        };

        this.restaurantPanelService.updatePlaceId(data).subscribe((res) => {
            console.log(res);

            this.getGoogleReviewFormDetails();
            // this.googleReviewForm.get("showGoogleReview").disable();
            this.googleReviewForm.get("placeId").disable();

            this.utilService.openSnackBar(
                "Google Review Details updated successfully"
            );
            this.isEditingGoogleReview = !this.isEditingGoogleReview;
        });
    }

    // Delivery Setting Functions

    getDeliveryFormDetails() {
        this.restaurantPanelService.getRestaurnatDetail().subscribe((res) => {
            this.deliveryForm.patchValue({
                provideDelivery:
                    res["data"]["restaurantDetail"]["provideDelivery"],
                maxDeliveryDistance:
                    res["data"]["restaurantDetail"]["maxDeliveryDistance"],
                minOrderValueForFreeDelivery:
                    res["data"]["restaurantDetail"][
                        "minOrderValueForFreeDelivery"
                    ],
                deliveryFeeBelowMinValue:
                    res["data"]["restaurantDetail"]["deliveryFeeBelowMinValue"],
                minOrderValueForDelivery:
                    res["data"]["restaurantDetail"]["minOrderValueForDelivery"],
            });
        });
    }

    toggleDeliveryEditMode() {
        if (!this.isEditingDelivery) {
            this.deliveryForm.get("provideDelivery").enable();
            this.deliveryForm.get("maxDeliveryDistance").enable();
            this.deliveryForm.get("minOrderValueForFreeDelivery").enable();
            this.deliveryForm.get("deliveryFeeBelowMinValue").enable();
            this.deliveryForm.get("minOrderValueForDelivery").enable();
            this.isEditingDelivery = !this.isEditingDelivery;
        } else {
            this.updateDeliveryData();
        }
    }

    updateDeliveryData() {
        this.restaurantPanelService
            .updateStoreSettings(this.deliveryForm.value)
            .subscribe((res) => {
                console.log(res);

                this.getDeliveryFormDetails();
                this.deliveryForm.get("provideDelivery").disable();
                this.deliveryForm.get("maxDeliveryDistance").disable();
                this.deliveryForm.get("minOrderValueForFreeDelivery").disable();
                this.deliveryForm.get("deliveryFeeBelowMinValue").disable();
                this.deliveryForm.get("minOrderValueForDelivery").disable();

                this.utilService.openSnackBar(
                    "Delivery Details updated successfully"
                );
                this.isEditingDelivery = !this.isEditingDelivery;
            });
    }

    // Social Media Setting Functions

    getSocialMediaFormDetails() {
        this.restaurantPanelService.getRestaurnatDetail().subscribe((res) => {
            this.socialMediaForm.patchValue({
                facebookUrl: res["data"]["restaurantDetail"]["facebookUrl"],
                instagramUrl: res["data"]["restaurantDetail"]["instagramUrl"],
                youtubeUrl: res["data"]["restaurantDetail"]["youtubeUrl"],
            });
        });
    }

    toggleSocialMediaEditMode() {
        if (!this.isEditingSocialMedia) {
            this.socialMediaForm.get("facebookUrl").enable();
            this.socialMediaForm.get("instagramUrl").enable();
            this.socialMediaForm.get("youtubeUrl").enable();
            this.isEditingSocialMedia = !this.isEditingSocialMedia;
        } else {
            this.updateSocialMediaData();
        }
    }

    updateSocialMediaData() {
        this.restaurantPanelService
            .updateStoreSettings(this.socialMediaForm.value)
            .subscribe((res) => {
                console.log(res);

                this.getSocialMediaFormDetails();
                this.socialMediaForm.get("facebookUrl").disable();
                this.socialMediaForm.get("instagramUrl").disable();
                this.socialMediaForm.get("youtubeUrl").disable();

                this.utilService.openSnackBar(
                    "Social Media Details updated successfully"
                );
                this.isEditingSocialMedia = !this.isEditingSocialMedia;
            });
    }

    // Availability Setting Functions

    getAvailabilityFormDetails() {
        // Fetch availability settings from the API and populate the form
        // Update this section to fetch actual data from your API
        this.restaurantPanelService.getRestaurnatDetail().subscribe((res) => {
            this.availabilityForm.patchValue({
                openTime: res["data"]["restaurantDetail"]["openTime"],
                closeTime: res["data"]["restaurantDetail"]["closeTime"],
                openDays: res["data"]["restaurantDetail"]["openDays"],
            });
        });
    }

    toggleAvailabilityEditMode() {
        if (!this.isEditingAvailability) {
            this.availabilityForm.get("openTime").enable();
            this.availabilityForm.get("closeTime").enable();
            this.availabilityForm.get("openDays").enable();
            this.isEditingAvailability = !this.isEditingAvailability;
        } else {
            this.updateAvailabilityData();
        }
    }

    updateAvailabilityData() {
        // Update the availability settings in the API using this.availabilityForm.value
        // After successful update, disable the form controls and display a success message
        // Update this section to send data to your API and handle the response
        this.restaurantPanelService
            .updateStoreSettings(this.availabilityForm.value)
            .subscribe((res) => {
                console.log(res);

                this.getAvailabilityFormDetails();
                this.availabilityForm.get("openTime").disable();
                this.availabilityForm.get("closeTime").disable();
                this.availabilityForm.get("openDays").disable();

                this.utilService.openSnackBar(
                    "Availability Details updated successfully"
                );
                this.isEditingAvailability = !this.isEditingAvailability;
            });
    }
}
