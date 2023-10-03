import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-store",
    templateUrl: "./store.component.html",
    styleUrls: ["./store.component.scss"],
})
export class StoreComponent implements OnInit {
    gstForm: FormGroup;
    isEditing: boolean = false;

    googleReviewForm: FormGroup;
    isEditingGoogleReview: boolean = false;

    deliveryForm: FormGroup;
    isEditingDelivery: boolean = false;


    socialMediaForm: FormGroup;
    isEditingSocialMedia: boolean = false;

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
        });
        

        this.getGSTFormDetails();

        this.gstForm.get("customGSTPercentage").disable();
        this.gstForm.get("isPricingInclusiveOfGST").disable();

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
        });

        this.getDeliveryFormDetails();

        this.deliveryForm.get("maxDeliveryDistance").disable();
        this.deliveryForm.get("minOrderValueForFreeDelivery").disable();
        this.deliveryForm.get("deliveryFeeBelowMinValue").disable();
        this.deliveryForm.get("provideDelivery").disable();

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
    }

    // GST Setting Functions

    getGSTFormDetails() {
        this.restaurantPanelService.getRestaurnatDetail().subscribe((res) => {
            this.gstForm.patchValue({
                isPricingInclusiveOfGST:
                    res["data"]["restaurantDetail"]["isPricingInclusiveOfGST"],
                customGSTPercentage:
                    res["data"]["restaurantDetail"]["customGSTPercentage"],
            });
        });
    }

    toggleEditMode() {
        if (!this.isEditing) {
            this.gstForm.get("isPricingInclusiveOfGST").enable();
            this.gstForm.get("customGSTPercentage").enable();
            this.isEditing = !this.isEditing;
        } else {
            this.updateRestaurantData();
        }
    }

    updateRestaurantData() {
        this.restaurantPanelService
            .updateStoreSettings(this.gstForm.value)
            .subscribe((res) => {
                console.log(res);

                this.getGSTFormDetails();
                this.gstForm.get("isPricingInclusiveOfGST").disable();
                this.gstForm.get("customGSTPercentage").disable();

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
            });
        });
    }

    toggleDeliveryEditMode() {
        if (!this.isEditingDelivery) {
            this.deliveryForm.get("provideDelivery").enable();
            this.deliveryForm.get("maxDeliveryDistance").enable();
            this.deliveryForm.get("minOrderValueForFreeDelivery").enable();
            this.deliveryForm.get("deliveryFeeBelowMinValue").enable();
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
}
