import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-add-payment",
    templateUrl: "./add-payment.component.html",
    styleUrls: ["./add-payment.component.scss"],
})
export class AddPaymentComponent implements OnInit {
    paymentForm: FormGroup;
    restaurantDataStore: any;
    destroy$: Subject<boolean> = new Subject<boolean>();
    constructor(
        private formBuilder: FormBuilder,
        private restaurantPanelService: RestaurantPanelService
    ) {}

    ngOnInit(): void {
        this.paymentForm = this.formBuilder.group({
            restaurantAccountId: ["", Validators.required],
         
        });
        this.paymentForm.disable();
        this.getRestaurantData();
    }
    getRestaurantData() {
        this.restaurantPanelService.restaurantData
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.restaurantDataStore = res;
                },
            });
    }
    onSubmit() {
        this.paymentForm.markAllAsTouched();
        if (this.paymentForm.valid) {
            const reqData = {
                restaurantAccountId: this.paymentForm.value.restaurantAccountId,
               
                restaurantId: this.restaurantDataStore._id,
            };
            this.restaurantPanelService
                .updatePaymentGateway(reqData)
                .subscribe({
                    next: (res) => {
                        this.paymentForm.reset();
                    },
                });
        }
    }

    checkError(fieldName: string, errorString: string) {
        return (
            this.paymentForm.get(fieldName).errors &&
            this.paymentForm.get(fieldName).errors[errorString] &&
            (this.paymentForm.get(fieldName).dirty ||
                this.paymentForm.get(fieldName).touched)
        );
    }

    toggleForm() {
        if (this.paymentForm.disabled) {
            this.paymentForm.enable();
        } else {
            this.onSubmit();
        }
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
