import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/api/user.service";

@Component({
    selector: "app-add-user",
    templateUrl: "./add-user.component.html",
    styleUrls: ["./add-user.component.scss"],
})
export class AddUserComponent implements OnInit {
    userForm: FormGroup;

    roles = ["restaurantOwner", "staff"];

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.userForm = this.formBuilder.group({
            name: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            phoneNumber: [
                "",
                [Validators.required, this.userService.phoneNumberValidator],
            ],
            role: ["", Validators.required],
            password: ["", Validators.required],
        });
    }

    saveUser() {
        this.userForm.markAllAsTouched();
        if (this.userForm.valid) {
            // Form is valid, proceed with saving the user

            // save user by calling API
            console.log(this.userForm.value);
            // User service has a method to add user
            this.userService.addUser(this.userForm.value).subscribe({
                next: (res: any) => {
                    console.log(res);
                    this.resetForm();
                    // navigate to user list page http://localhost:4200/admin/user-managment/view
                    this.router.navigate(["../view"], {
                        relativeTo: this.route,
                    });
                },
                error: (err: any) => {
                    console.log(err);
                },
            });

            // Reset the form
        }
    }

    checkError(fieldName: string, errorString: string) {
        return (
            this.userForm.get(fieldName).errors &&
            this.userForm.get(fieldName).errors[errorString] &&
            (this.userForm.get(fieldName).dirty ||
                this.userForm.get(fieldName).touched)
        );
    }

    resetForm() {
        this.userForm.reset();
    }

    get name() {
        return this.userForm.get("name");
    }

    get phoneNumber() {
        return this.userForm.get("phoneNumber");
    }

    get email() {
        return this.userForm.get("email");
    }

    get role() {
        return this.userForm.get("role");
    }

    get password() {
        return this.userForm.get("password");
    }

    // Add this property
    showPassword: boolean = false;

    // Add this method
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}
