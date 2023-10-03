import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
    FormGroup,
    FormControl,
    FormControlName,
    Validator,
    FormBuilder,
    Validators,
    AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-promocode",
    templateUrl: "./promocode.component.html",
    styleUrls: ["./promocode.component.scss"],
})
export class PromocodeComponent implements OnInit {
    promoCodeForm: FormGroup;
    // router: any;
    meal_times = [
        { name: "All day", time: "24 hours" },
        { name: "Breakfast", time: "5:00 AM - 11:00 AM" },
        { name: "Lunch", time: "11:00 PM - 3:00 PM" },
        { name: "Snack", time: "3:00 PM - 7:00 PM" },
        { name: "Dinner", time: "7:00 PM - 11:00 PM" },
        { name: "Late night", time: "11:00 PM - 05:00 AM" },
    ];
    allDays: string[] = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    constructor(
        private fb: FormBuilder,
        private restaurantService: RestaurantPanelService,
        private utilService: UtilService,
        public router: Router
    ) {
        // Initialize the FormGroup with FormBuilder
        this.promoCodeForm = this.fb.group(
            {
                codeName: ["", Validators.required],
                description: [""],
                discountAmount: [""],
                discountType: ["percentage", Validators.required],
                minOrderValue: ["", [Validators.required, Validators.min(0)]],
                startDate: ["", Validators.required],
                endDate: ["", Validators.required],
                perUserLimit: ["", [Validators.required, Validators.min(1)]],
                totalUsageLimit: ["", [Validators.required, Validators.min(1)]],
                applicableFor: ["new", Validators.required],
                mealTime: ["", [Validators.required]],
                runThisOffer: [true],
                days: ["", Validators.required],
                maxDiscount: ["", [Validators.required, Validators.min(0)]],
                active: [true],
            },
            {
                validator: [this.dateRangeValidator],
            }
        );
    }

    // Add this function in your component class
    dateRangeValidator(
        control: AbstractControl
    ): { [key: string]: any } | null {
        const startDate = control.get("startDate").value;
        const endDate = control.get("endDate").value;

        if (startDate && endDate && startDate > endDate) {
            return { invalidDateRange: true };
        }

        return null;
    }

    isMaxDiscountValid() {
        if (
            this.promoCodeForm.get("maxDiscount").value >
            this.promoCodeForm.get("minOrderValue").value
        ) {
            return false;
        }

        return true;
    }

    checkMaxDiscountValidator(
        control: AbstractControl
    ): { [key: string]: any } | null {
        if (
            control.value > this.promoCodeForm.get("minOrderValue").value ||
            control.value === this.promoCodeForm.get("minOrderValue").value
        ) {
            return null;
        }
        return { invalidMaxDiscount: true };
    }

    isDiscountAmountValid() {
        if (
            this.promoCodeForm.get("discountType").value === "percentage" &&
            (this.promoCodeForm.get("discountAmount").value > 100 ||
                this.promoCodeForm.get("discountAmount").value < 0)
        ) {
            return false;
        }
        return true;
    }

    checkDiscountAmountValidator(
        control: AbstractControl
    ): { [key: string]: any } | null {
        if (
            this.promoCodeForm.get("discountType").value === "percentage" &&
            (control.value > 100 || control.value < 0)
        ) {
            return { invalidDiscountAmount: true };
        }
        return null;
    }

    ngOnInit() {}

    onSubmit() {
        this.promoCodeForm.markAllAsTouched();

        if (
            this.promoCodeForm.valid &&
            // this.isMaxDiscountValid() &&
            this.isDiscountAmountValid()
        ) {
            console.log("Form is valid, proceed with saving the promo code");
            const formData = this.promoCodeForm.value;

            this.restaurantService.addPromoCode(formData).subscribe((res) => {
                console.log("Promo code added successfully" + res);
                console.log(res);

                this.router.navigate(["/admin/promocode/view"]);
            });
        } else {
            console.log("form is invalid");

            // Form is invalid, display error messages
            // mention which fields are invalid

            console.log(this.promoCodeForm.value);
            if (this.promoCodeForm.get("codeName").invalid) {
                console.log("codeName is invalid");
            }
            if (this.promoCodeForm.get("description").invalid) {
                console.log("description is invalid");
            }
            if (this.promoCodeForm.get("discountAmount").invalid) {
                console.log("discountAmount is invalid");
            }
            if (this.promoCodeForm.get("discountType").invalid) {
                console.log("discountType is invalid");
            }
            if (this.promoCodeForm.get("minOrderValue").invalid) {
                console.log("minOrderValue is invalid");
            }
            if (this.promoCodeForm.get("startDate").invalid) {
                console.log("startDate is invalid");
            }
            if (this.promoCodeForm.get("endDate").invalid) {
                console.log("endDate is invalid");
            }
            if (this.promoCodeForm.get("perUserLimit").invalid) {
                console.log("perUserLimit is invalid");
            }
            if (this.promoCodeForm.get("totalUsageLimit").invalid) {
                console.log("totalUsageLimit is invalid");
            }
            if (this.promoCodeForm.get("applicableFor").invalid) {
                console.log("applicableFor is invalid");
            }
            if (this.promoCodeForm.get("mealTime").invalid) {
                console.log("mealTime is invalid");
            }
            if (this.promoCodeForm.get("runThisOffer").invalid) {
                console.log("runThisOffer is invalid");
            }
            if (this.promoCodeForm.get("usedCount").invalid) {
                console.log("usedCount is invalid");
            }
            if (this.promoCodeForm.get("days").invalid) {
                console.log("days is invalid");
            }
            if (this.promoCodeForm.get("maxDiscount").invalid) {
                console.log("maxDiscount is invalid");
            }
            if (this.promoCodeForm.get("active").invalid) {
                console.log("active is invalid");
            }
            return;
        }
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.promoCodeForm.get(fieldName).hasError(errorString) &&
            this.promoCodeForm.get(fieldName).touched
        );
    }
}
