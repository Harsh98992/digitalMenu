import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "src/app/api/authentication.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { ConfirmedValidator } from "src/app/auth/common/confirmed.validator";

import { environment } from "src/environments/environment";

@Component({
    selector: "app-add-contact-details",
    templateUrl: "./add-contact-detail.component.html",
    styleUrls: ["./add-contact-detail.component.scss"],
})
export class AddContactDetailsComponent implements OnInit {
    apiUrl = environment.apiUrl;
    form: FormGroup;
    editMode = false;
    contactId: string;

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private restaurnatPanelService: RestaurantPanelService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            // Define your form controls and their initial values
            categoryType: ["", [Validators.required]],
            categoryDetail: ["", [Validators.required]],

            // ... other form controls
        });
        this.changeValidation();
        this.checkEditMode();
    }
    checkEditMode() {
        this.route.params.subscribe((params) => {
            this.editMode = true;
            this.contactId = params["id"]; // Replace 'paramName' with your actual parameter name
        });
        this.route.queryParams.subscribe((params) => {
            const data = {
                categoryType: params["contactType"],
                categoryDetail: params["contactDetails"],
            };

            this.form.patchValue(data); // Replace 'paramName' with your actual query parameter name
            this.changeValidation();
        });
    }

    checkForError(fieldName: string, errorString: string) {
        return (
            this.form.get(fieldName).errors &&
            this.form.get(fieldName).errors[errorString] &&
            (this.form.get(fieldName).dirty || this.form.get(fieldName).touched)
        );
    }
    onSubmit() {
        this.form.markAllAsTouched();
        if (!this.form.invalid) {
            if (this.contactId) {
                const reqData = {
                    contactId: this.contactId,
                    contactType: this.form.value.categoryType,
                    contactDetails: this.form.value.categoryDetail,
                };

                this.restaurnatPanelService
                    .updateContactDetail(reqData)
                    .subscribe({
                        next: () => {
                            this.restaurnatPanelService.setRestaurantData();
                            this.router.navigateByUrl(
                                "/admin/restaurent-contact-details/view"
                            );
                        },
                    });
            } else {
                const reqData = {
                    contactType: this.form.value.categoryType,
                    contactDetails: this.form.value.categoryDetail,
                };

                this.restaurnatPanelService
                    .addContactDetails(reqData)
                    .subscribe({
                        next: () => {
                            this.restaurnatPanelService.setRestaurantData();
                            this.router.navigateByUrl(
                                "/admin/restaurent-contact-details/view"
                            );
                        },
                    });
            }
        }
    }
    changeValidation() {
        const value = this.form.get("categoryType").value;
        if (value === "email") {
            this.form
                .get("categoryDetail")
                .setValidators([Validators.required, Validators.email]);
        } else {
            this.form
                .get("categoryDetail")
                .setValidators([
                    Validators.required,
                    Validators.pattern(/^\d{10}$/),
                ]);
        }
        this.form.controls["categoryDetail"].updateValueAndValidity();
    }
}
