import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { PhoneOtpComponent } from "src/app/angular-material/phone-otp/phone-otp.component";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";

@Component({
    selector: "app-phone-number-dialog",
    templateUrl: "./phone-number-dialog.component.html",
    styleUrls: ["./phone-number-dialog.component.scss"],
})
export class PhoneNumberDialogComponent implements OnInit {
    phoneNumberForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private customerAuthService: CustomerAuthService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.phoneNumberForm = this.fb.group({
            phoneNumber: [
                "",
                [Validators.required, Validators.pattern("^[0-9]{10}$")],
            ],
        });
    }
    submitForm() {
        this.phoneNumberForm.markAllAsTouched();
        if (this.phoneNumberForm.valid) {
            const phoneNumber = this.phoneNumberForm.get("phoneNumber").value;
            const reqData = {
                phoneNumber: phoneNumber,
                socialLogin: this.data.socialLogin,
                verificationType: "login",
            };
            this.customerAuthService
                .sendWhatsappVerificationCode(reqData)
                .subscribe({
                    next: (res) => {
                        this.dialog.open(PhoneOtpComponent, {
                            disableClose: true,
                            data: reqData,
                            panelClass: "app-full-bleed-dialog",
                        });
                    },
                });

            // Do something with the phoneNumber, e.g., send to server or process locally
        }
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.phoneNumberForm.get(fieldName).errors &&
            this.phoneNumberForm.get(fieldName).errors[errorString] &&
            (this.phoneNumberForm.get(fieldName).dirty ||
                this.phoneNumberForm.get(fieldName).touched)
        );
    }
}
