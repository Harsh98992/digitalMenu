import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { UserService } from "src/app/api/user.service";

@Component({
    selector: "app-edit-user",
    templateUrl: "./edit-user.component.html",
    styleUrls: ["./edit-user.component.scss"],
})
export class EditUserComponent implements OnInit {
    userId: string;
    userForm: FormGroup;
    roles = ["restaurantOwner", "staff"];

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            // Get the user ID from the route parameters as /edit/:id
            this.userId = params["id"];
            this.getUser(this.userId);
        });

        this.userForm = this.formBuilder.group({
            name: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            phoneNumber: [
                "",
                [Validators.required, this.userService.phoneNumberValidator],
            ],
            role: ["", Validators.required],
        });
    }

    getUser(userId: string) {
        this.userService.getUser(userId).subscribe({
            next: (response: any) => {
                // console.log('User:', user);
                // Populate the form fields with user data
                this.userForm.patchValue({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    phoneNumber: response.data.user.phoneNumber,
                    role: response.data.user.role,
                });
            },
            error: (err: any) => {
                console.log("Error getting user:", err);
            },
        });
    }

    editUser() {
        this.userForm.markAllAsTouched();
        if (this.userForm.valid) {
            // Form is valid, proceed with saving the user
            const userData = this.userForm.value;

            this.userService.editUser(this.userId, userData).subscribe({
                next: (res: any) => {
                    console.log("User updated:", res);
                    // Redirect back to the view user page
                    // You can also show a success message to the user

                    this.router.navigate(["../view"], { relativeTo: this.route });

                },
                error: (err: any) => {
                    console.log("Error updating user:", err);
                },
            });
        } else {
            // Form is invalid, display error messages
            console.log("Invalid form");

            console.log(this.userForm);

            return;
        }
    }

    resetForm() {
        this.userForm.reset();
    }

    get name() {
        return this.userForm.get("name");
    }

    get email() {
        return this.userForm.get("email");
    }

    get phoneNumber() {
        return this.userForm.get("phoneNumber");
    }

    get role() {
        return this.userForm.get("role");
    }
}
