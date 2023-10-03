import {
    GoogleLoginProvider,
    SocialAuthService,
} from "@abacritt/angularx-social-login";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/api/authentication.service";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { PhoneNumberDialogComponent } from "./phone-number-dialog/phone-number-dialog.component";

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
        private dialog: MatDialog
    ) {}

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
    }

    signOut(): void {
        this.authService.signOut();
    }
    closeDialog() {
        this.dialogRef.close();
    }
    openPhoneNumberDialog(socialLogin) {
        let dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
            disableClose: true,
            data: {
                socialLogin: socialLogin,
            },

            panelClass: "app-full-bleed-dialog",
        });
    }
}
