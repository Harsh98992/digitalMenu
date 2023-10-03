import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/api/authentication.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["../common/auth.component.scss"],
})
export class LoginComponent implements OnInit {
    passwordFlag = true;
    loginForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private authService: AuthenticationService,
        private utilService: UtilService,
        private router: Router,
        private restaurnatPanelService: RestaurantPanelService
    ) {}

    ngOnInit(): void {
        this.generateForm();
    }
    generateForm() {
        this.loginForm = this.fb.group({
            email: [
                "",
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(
                        "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}"
                    ),
                ],
            ],
            password: [
                "",
                [
                    Validators.required,
                    Validators.pattern(
                        "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                    ),
                ],
            ],
        });
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.loginForm.get(fieldName).errors &&
            this.loginForm.get(fieldName).errors[errorString] &&
            (this.loginForm.get(fieldName).dirty ||
                this.loginForm.get(fieldName).touched)
        );
    }

    togglePassowrdHide(field) {
        this.passwordFlag = !this.passwordFlag;
        field.type = !this.passwordFlag ? "text" : "password";
    }
    submitForm() {
        this.loginForm.markAllAsTouched();
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: (res: any) => {
                    this.authService.setUserToken(res.data.token);
                    console.log(res.data.user?.restaurantVerified);
                    this.restaurnatPanelService.setRestaurantStatus(
                        res.data.user?.restaurantVerified
                    );
                    this.authService.setUserDetail(res.data.user);
                    if (res.data.user.role === "admin") {
                        this.router.navigateByUrl("/admin/unVerifyRequest");
                    } else {
                        if (res.data.user?.restaurantVerified) {
                            this.router.navigateByUrl("/admin");
                        } else {
                            this.router.navigateByUrl(
                                "/admin/restaurant-profile"
                            );
                        }
                    }
                },
            });
        }
    }
}
