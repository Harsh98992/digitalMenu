import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/api/user.service";

@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
    userForm: FormGroup;
    editMode: boolean = false;
    userId: string;
    roles: string[] = ["restaurantOwner", "staff"];

    // Getters for form controls
    get nameControl(): FormControl {
        return this.userForm.get("name") as FormControl;
    }

    get emailControl(): FormControl {
        return this.userForm.get("email") as FormControl;
    }

    get phoneNumberControl(): FormControl {
        return this.userForm.get("phoneNumber") as FormControl;
    }

    get roleControl(): FormControl {
        return this.userForm.get("role") as FormControl;
    }

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        // Initialize the form with validators
        this.userForm = this.formBuilder.group({
            name: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            phoneNumber: [
                "",
                [Validators.required, this.userService.phoneNumberValidator],
            ],
            role: ["", Validators.required],
        });

        this.userId = this.route.snapshot.params["id"];
        this.getUser();

        // disable the form controls of the email and phone number
        this.userForm.get("email").disable();
        this.userForm.get("phoneNumber").disable();
    }

    getUser() {
        // Fetch user data from the API
        this.userService.getMe().subscribe({
            next: (response: any) => {
                const userData = response.data; // Assuming the API response has a 'data' property containing the user details

                // Populate the form fields with user data
                this.userForm.patchValue(userData.user);
                this.userForm.disable(); // Disable the form controls to view mode
                this.userId = userData.user._id;
            },
            error: (err: any) => {
                console.log("Error fetching user:", err);
                // Handle error scenario, e.g., display an error message or redirect to an error page
            },
        });
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.userForm.enable(); // Enable the form controls for editing
            this.userForm.get("role").disable();
            this.userForm.get("email").disable();
            this.userForm.get("phoneNumber").disable();
        } else {
            this.userForm.disable(); // Disable the form controls to view mode
        }
    }

    editUser() {
        this.userForm.markAllAsTouched();

        if (!this.editMode) {
            // Form is in edit mode, proceed with saving the user
            this.toggleEditMode();
            return;
        }

        if (this.userForm.valid) {
            // Form is valid, proceed with saving the user
            const userData = this.userForm.value;

            console.log("User data:", userData);
            console.log("User id:", this.userId);

            this.userService.editUser(this.userId, userData).subscribe({
                next: (res: any) => {
                    console.log("User updated:", res);

                    this.toggleEditMode();

                    // Redirect back to the view user page
                    this.router.navigate(["/admin/user-profile"]);
                },
                error: (err: any) => {
                    console.log("Error updating user:", err);
                    // Handle error scenario, e.g., display an error message or redirect to an error page
                },
            });
        } else {
            // Form is invalid, display error messages

            // Loop through form controls and display validation errors

            console.log(this.userForm.controls);
        }
    }
}
