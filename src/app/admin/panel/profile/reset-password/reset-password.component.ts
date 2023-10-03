import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/api/authentication.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { ConfirmedValidator } from "src/app/auth/common/confirmed.validator";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

@Component({
    selector: "app-reset-password",
    templateUrl: "./reset-password.component.html",
    styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
    form: FormGroup;
    hidePassword: boolean = true;
    newPasswordHideFlag: boolean = true;
    confirmNewPasswordHideFlag: boolean = true;

    togglPasswordVisibility() {
        this.hidePassword = !this.hidePassword;
    }

    toggleNewPassword() {
        this.newPasswordHideFlag = !this.newPasswordHideFlag;
    }
    toggleConfirmNewPassword() {
        this.confirmNewPasswordHideFlag = !this.confirmNewPasswordHideFlag;
    }

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private restaurantService: RestaurantPanelService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group(
            {
                // Define your form controls and their initial values
                oldPassword: [
                    "",
                    [
                        Validators.required,
                        Validators.pattern(
                            "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                        ),
                    ],
                ],
                newPassword: [
                    "",
                    [
                        Validators.required,
                        Validators.pattern(
                            "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                        ),
                    ],
                ],
                cnPassword: [
                    "",
                    [
                        Validators.required,
                        Validators.pattern(
                            "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                        ),
                    ],
                ],

                // ... other form controls
            },
            {
                validator: ConfirmedValidator("newPassword", "cnPassword"),
            }
        );
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.form.get(fieldName).errors &&
            this.form.get(fieldName).errors[errorString] &&
            (this.form.get(fieldName).dirty || this.form.get(fieldName).touched)
        );
    }
    onSubmit() {
        console.log("hello");
        this.form.markAllAsTouched();
        if (!this.form.invalid) {
            const passwordData = {
                oldPassword: this.form.value.oldPassword,
                newPassword: this.form.value.newPassword,
            };

            this.authService
                .changePassword(passwordData)
                .subscribe((response: any) => {
                    this.authService.removeToken();
                    this.restaurantService.restaurantData.next({});
                    this.router.navigateByUrl("/admin/login");
                });
        }
    }
}
