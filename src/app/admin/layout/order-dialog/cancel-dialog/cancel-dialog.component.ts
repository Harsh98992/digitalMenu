import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { io } from "socket.io-client";
import { OrderService } from "src/app/api/order.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-cancel-dialog",
    templateUrl: "./cancel-dialog.component.html",
    styleUrls: ["./cancel-dialog.component.scss"],
})
export class CancelDialogComponent implements OnInit {
    cancelOrderForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private orderService: OrderService,
        @Inject(MAT_DIALOG_DATA) public orderData: any,
        private dialogRef: MatDialogRef<CancelDialogComponent>
    ) {
        this.socket = io(this.socketApiUrl);
    }

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    ngOnInit(): void {
        console.log(this.orderData);

        this.generateForm();
    }
    generateForm() {
        this.cancelOrderForm = this.fb.group({
            reason: ["", Validators.required],
        });
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.cancelOrderForm.get(fieldName).errors &&
            this.cancelOrderForm.get(fieldName).errors[errorString] &&
            (this.cancelOrderForm.get(fieldName).dirty ||
                this.cancelOrderForm.get(fieldName).touched)
        );
    }
    submitForm() {
        this.cancelOrderForm.markAllAsTouched();
        if (!this.cancelOrderForm.valid) {
            return;
        }
        const reqData = {
            orderId: this.orderData._id,
            reason: this.cancelOrderForm.get("reason").value,
            orderStatus: "rejected",
        };

        this.orderService.changeOrderStatus(reqData).subscribe({
            next: (res) => {
                this.socket.emit("orderAcceptedOrRejected", this.orderData);

                this.dialogRef.close({ successFlag: true });
            },
        });
    }
}
