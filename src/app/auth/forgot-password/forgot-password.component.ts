import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { AuthenticationService } from "src/app/api/authentication.service";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-forgot-password",
    templateUrl: "./forgot-password.component.html",
    styleUrls: ["../common/auth.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private authService: AuthenticationService,
        private utilService: UtilService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.generateForm();
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.forgotPasswordForm.get(fieldName).errors &&
            this.forgotPasswordForm.get(fieldName).errors[errorString] &&
            (this.forgotPasswordForm.get(fieldName).dirty ||
                this.forgotPasswordForm.get(fieldName).touched)
        );
    }
    generateForm() {
        this.forgotPasswordForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
        });
    }
    submitForm() {
        this.forgotPasswordForm.markAllAsTouched();
        if (this.forgotPasswordForm.valid) {
            this.authService
                .forgotPassword(this.forgotPasswordForm.get("email").value)
                .subscribe({
                    next: (res: any) => {
                        this.openConfirmModal(res);
                        // this.authService.setUserToken(res.data.token);
                    },
                });
        }
    }
    openConfirmModal(res) {
        const dialogData = {
            title: "Confirm",
            message: res.data.message,
        };
        this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            disableClose: true,
        });
    }
}
