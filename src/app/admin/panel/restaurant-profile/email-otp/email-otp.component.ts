// email-otp.component.ts
import { Component, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/api/authentication.service";
import { UtilService } from "src/app/api/util.service";
import { Inject } from "@angular/core";

@Component({
    selector: "app-email-otp",
    templateUrl: "./email-otp.component.html",
    styleUrls: ["./email-otp.component.scss"],
})
export class EmailOtpComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authService: AuthenticationService,
        private utilService: UtilService,
        private dialogRef: MatDialogRef<any>
    ) {}

    ngOnInit(): void {}

    validateOtp(field: any) {
        console.log(field.value);

        const enteredValue = field.value;
        if (enteredValue) {
            this.authService
                .verifyEmailOtp(
                    enteredValue.toString(),
                    this.data.restaurantEmail
                )
                .subscribe({
                    next: (res: any) => {
                        // if the otp is valid, close the dialog and send a flag to the parent component

                        this.dialogRef.close({ flag: true });
                    },
                });
        }
    }

    resendOtp() {
        // const restaurantEmail = ""; // Get the restaurant email from the component's data or any other source
        const restaurantEmail = this.data.restaurantEmail;
        this.authService.sendEmailVerificationOtp(restaurantEmail).subscribe({
            next: (res: any) => {},
        });
    }
}
