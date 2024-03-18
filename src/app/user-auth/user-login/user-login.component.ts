// import {
//     GoogleLoginProvider,
//     SocialAuthService,
// } from "@abacritt/angularx-social-login";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/api/authentication.service";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PhoneOtpComponent } from "src/app/angular-material/phone-otp/phone-otp.component";
import { CustomerNameDialogComponent } from "src/app/angular-material/customer-name-dialog/customer-name-dialog.component";
import { CustomerService } from "src/app/api/customer.service";

@Component({
    selector: "app-user-login",
    templateUrl: "./user-login.component.html",
    styleUrls: ["./user-login.component.scss"],
})
export class UserLoginComponent implements OnInit {
    constructor(
        // private authService: SocialAuthService,
        private dialogRef: MatDialogRef<any>,
        private customerAuthService: CustomerAuthService,
        private dialog: MatDialog,
        private fb: FormBuilder ,
        private customerService: CustomerService
    ) {}
    phoneNumberForm: FormGroup;
    customerData: any;

    customerName: any;

    customerEmail: any;

    ngOnInit(): void {
        // this.authService.authState.subscribe((user) => {
        //     user["socialLogin"] = true;
        //     this.customerAuthService.customerLogin(user).subscribe({
        //         next: (res: any) => {
        //             if (res.data.token) {
        //                 user["role"] = "user";
        //                 this.customerAuthService.setUserToken(res.data.token);
        //                 this.customerAuthService.setUserDetail(
        //                     res.data.userData
        //                 );
        //                 this.dialogRef.close();
        //             }
        //         },
        //     });
        // });

        this.phoneNumberForm = this.fb.group({
            phoneNumber: [
                "",
                [Validators.required, Validators.pattern("^[0-9]{10}$")],
            ],
        });

    }

    signOut(): void {
        // this.authService.signOut();
    }
    onPhoneNumberChange(event: any) {
        const inputValue = event.target.value;
        if (inputValue.length > 10) {
          // Truncate the input value to 10 characters
          this.phoneNumberForm.patchValue({
            phoneNumber: inputValue.slice(0, 10)
          });
        }
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
                                this.dialogRef.close();
                                // // Open the dialog to ask for the customer's name
                                // const dialogRef = this.dialog.open(CustomerNameDialogComponent);

                                // // After the dialog is closed, get the customer's name from the result
                                // dialogRef.afterClosed().subscribe(result => {
                                //     if (result) {
                                //         // Save the customer's name
                                //         this.customerService.updateCustomerData
                                //         ({name: result}).subscribe({
                                //             next: (res) => {
                                //                 console.log(res);
                                //             }
                                //         });
                                //     }
                                // });

                                // check if the customer's name is already saved
                                this.customerService.getCustomer().subscribe({
                                    next: (res: any) => {

                                        console.log("the customer data is", res.data);

                                        this.customerData = res.data.customer;


                                        // make a customer email from the phone number if it is not already saved and phone number is saved

                                        if (!this.customerData.email && this.customerData.phoneNumber) {
                                            this.customerEmail = this.customerData.phoneNumber + "@qrsay.com";

                                        }

                                        if (res.data.customer.name) {
                                            // The customer's name is already saved
                                            this.dialogRef.close();
                                        } else {
                                            // Open the dialog to ask for the customer's name
                                            const dialogRef = this.dialog.open(CustomerNameDialogComponent);

                                            // After the dialog is closed, get the customer's name from the result
                                            dialogRef.afterClosed().subscribe(result => {
                                                if (result) {
                                                    // Save the customer's nam\\

                                                    if(this.customerData.email){
                                                    this.customerService.updateCustomerData
                                                    ({name: result }).subscribe({
                                                        next: (res) => {
                                                            console.log(res);
                                                        }
                                                    });
                                                }
                                                else{
                                                    this.customerService.updateCustomerData
                                                    ({name: result,
                                                    email : this.customerEmail}).subscribe({
                                                        next: (res) => {
                                                            console.log(res);
                                                        }
                                                    });
                                                }
                                                }
                                            });
                                        }
                                    },
                                })


                            }
                        })
                    },
                });
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
