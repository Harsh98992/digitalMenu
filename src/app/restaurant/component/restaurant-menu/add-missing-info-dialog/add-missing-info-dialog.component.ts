import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
    selector: "app-add-missing-info-dialog",
    templateUrl: "./add-missing-info-dialog.component.html",
    styleUrls: ["./add-missing-info-dialog.component.scss"],
})
export class AddMissingInfoDialogComponent implements OnInit {
    customerForm: FormGroup; // Form group for customer data
    nameInvalid = false;
    emailInvalid = false;
    phoneNumberInvalid = false;

    constructor(
        private dialogRef: MatDialogRef<AddMissingInfoDialogComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public customerData: any // Inject customerData
    ) {}

    ngOnInit() {
        // Initialize the form with validation based on missing data
        this.customerForm = this.formBuilder.group({
            name: [
                this.customerData.name || "",
                this.customerData.name ? [] : Validators.required,
            ],
            email: [
                this.customerData.email || "",
                this.customerData.email
                    ? []
                    : [ Validators.email],
            ],
            phoneNumber: [
                this.customerData.phoneNumber || "",
                [
                    Validators.required,
                    Validators.pattern(/^\d{10}$/), // Ensure it's a 10-digit number
                ],
            ],
        });
    }

    submitForm() {
        let reqData = {};
        // Check form validity
        if (this.customerForm.invalid) {
            // Mark form controls as touched to display error messages
            this.customerForm.markAllAsTouched();
            return;
        }
        if (!this.customerData.name) {
            reqData["name"] = this.customerForm.value.name;
        }
        if (!this.customerData.email) {
            reqData["email"] = this.customerForm.value.email;
        }
        if (!this.customerData.phoneNumber) {
            reqData["phoneNumber"] = this.customerForm.value.phoneNumber;
        }

        // Close the dialog with the customer data
        this.dialogRef.close({ customerData: reqData });
    }

    checkInvalid(controlName: string): boolean {
        const control = this.customerForm.get(controlName);
        return control ? control.invalid && control.touched : false;
    }
}
