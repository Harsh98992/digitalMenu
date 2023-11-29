import {
    GoogleLoginProvider,
    SocialAuthService,
} from "@abacritt/angularx-social-login";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/api/authentication.service";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PhoneOtpComponent } from "src/app/angular-material/phone-otp/phone-otp.component";

@Component({
    selector: "app-user-login",
    templateUrl: "./user-login.component.html",
    styleUrls: ["./user-login.component.scss"],
})
export class UserLoginComponent implements OnInit {
    constructor(
        private authService: SocialAuthService,
        private dialogRef: MatDialogRef<any>,
        private customerAuthService: CustomerAuthService,
        private dialog: MatDialog,
        private fb: FormBuilder ,
    ) {}
    phoneNumberForm: FormGroup;

    ngOnInit(): void {
        this.authService.authState.subscribe((user) => {
            user["socialLogin"] = true;
            this.customerAuthService.customerLogin(user).subscribe({
                next: (res: any) => {
                    if (res.data.token) {
                        user["role"] = "user";
                        this.customerAuthService.setUserToken(res.data.token);
                        this.customerAuthService.setUserDetail(
                            res.data.userData
                        );
                        this.dialogRef.close();
                    }
                },
            });
        });

        this.phoneNumberForm = this.fb.group({
            phoneNumber: [
                "",
                [Validators.required, Validators.pattern("^[0-9]{10}$")],
            ],
        });

    }

    signOut(): void {
        this.authService.signOut();
    }
    closeDialog() {
        this.dialogRef.close();
    }



    submitForm() {
        this.phoneNumberForm.markAllAsTouched();
        if (this.phoneNumberForm.valid) {
            const phoneNumber = this.phoneNumberForm.get("phoneNumber").value;
            const reqData = {
                phoneNumber: phoneNumber,
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
                        }).afterClosed().subscribe((res)=>{
                            if(res==="apiCall"){
                                this.dialogRef.close()
                            }
                        })
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
