import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-add-complete-address",
    templateUrl: "./add-complete-address.component.html",
    styleUrls: ["./add-complete-address.component.scss"],
})
export class AddCompleteAddressComponent {
    addressForm: FormGroup;
    googleLocationAddress = "";
    constructor(
        public dialogRef: MatDialogRef<AddCompleteAddressComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.addressForm = this.formBuilder.group({
            completeAddress: ["", Validators.required],
            pinCode: ["", Validators.required],
            phoneNumber: ["", [Validators.pattern("[0-9]{10}")]],
            landmark: [""],
            googleLocationAddress: [""],
        });

        this.addressForm.patchValue({
            pinCode: data.pinCode || "",
            googleLocationAddress: data.googleLocationAddress || "",
        });
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.addressForm.get(fieldName).errors &&
            this.addressForm.get(fieldName).errors[errorString] &&
            (this.addressForm.get(fieldName).dirty ||
                this.addressForm.get(fieldName).touched)
        );
    }
    onSaveClick() {
        if (this.addressForm.invalid) {
            // Mark form controls as touched to trigger validation messages
            this.markFormGroupTouched(this.addressForm);
        } else {
            // Save the complete address, pin code, phone number, and landmark, and close the dialog
            const completeAddressData = {
                latitude: this.data.latitude,
                longitude: this.data.longitude,
                completeAddress: this.addressForm.value.completeAddress,
                pinCode: this.addressForm.value.pinCode,
                phoneNumber: this.addressForm.value.phoneNumber,
                landmark: this.addressForm.value.landmark,
                googleLocationAddress:
                    this.addressForm.value.googleLocationAddress,
            };

            this.dialogRef.close(completeAddressData);
        }
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach((control) => {
            control.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
