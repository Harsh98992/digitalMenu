import { Component, Inject, OnInit } from "@angular/core";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-phone-otp",
    templateUrl: "./phone-otp.component.html",
    styleUrls: ["./phone-otp.component.scss"],
})
export class PhoneOtpComponent implements OnInit {
    timerDisplay: string;
    timeRemaining: number = 30;
    timerInterval: any;
    timerBlocked = false;
    constructor(
        private customerAuthService: CustomerAuthService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<PhoneOtpComponent>
    ) {}

    isWhatsappLogin = false;
    isPhoneLogin = false;

    ngOnInit(): void {
        console.log("the data sent to phone otp is", this.data);

        if (this.data.socialLogin === "whatsApp") {
            this.isWhatsappLogin = true;
        }
        if (this.data.socialLogin === "sms") {
            this.isPhoneLogin = true;
        }
    }
    checkLength(event) {
        const value = event.target.value;
        if (value && String(value).length > 3) {
            return false;
        }
        return true;
    }
    resendOtp() {
        console.log(this.timeRemaining);

        if (this.timerBlocked) {
            const dialogData = {
                title: "Confirm",
                message: `You can generate and send the next OTP after a ${this.timerDisplay} second.`,
            };
            this.dialog
                .open(ConfirmDialogComponent, { data: dialogData })
                .afterClosed()
                .subscribe({
                    next: (res: any) => {},
                });
        } else {
            this.timeRemaining = 30;
            const reqData = this.data;
            this.customerAuthService
                .sendWhatsappVerificationCode(reqData)
                .subscribe({
                    next: (res) => {
                        this.startTimer();
                    },
                });
        }
    }
    startTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(() => {
            this.timerBlocked = true;
            this.timeRemaining--;
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            this.timerDisplay = `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;

            if (this.timeRemaining === 0) {
                clearInterval(this.timerInterval);
                this.timerBlocked = false;
            }
        }, 1000);
    }

    validateOtp(field: any) {
        const enteredValue = field.value;
        if (enteredValue) {
            const reqData = {
                otp: enteredValue,
                phoneNumber: this.data.phoneNumber,
            };
            this.customerAuthService.validateWhatsAppOTp(reqData).subscribe({
                next: (res) => {
                    if (this.data.verificationType === "login") {
                        this.customerAuthService
                            .whatsappLogin({
                                phoneNumber: String(this.data.phoneNumber),
                            })
                            .subscribe({
                                next: (res: any) => {
                                    this.customerAuthService.setUserToken(
                                        res.data.token
                                    );
                                    this.customerAuthService.setUserDetail(
                                        res.data.userData
                                    );
                                    this.dialogRef.close("apiCall");
                                },
                            });
                    }

                    if (this.data.verificationType === "update") {
                        // close this dialog phone-otp
                        this.dialogRef.close("apiCall");
                    }
                },
            });
        }
    }
}
