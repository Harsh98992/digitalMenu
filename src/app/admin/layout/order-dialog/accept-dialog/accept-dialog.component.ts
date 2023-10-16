import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { io } from "socket.io-client";
import { OrderService } from "src/app/api/order.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-accept-dialog",
    templateUrl: "./accept-dialog.component.html",
    styleUrls: ["./accept-dialog.component.scss"],
})
export class AcceptDialogComponent implements OnInit {
    //  time=['15 min','30 min','45 min','1 hour','1 hour 15 min','1 hour 30 min'],
    cashOnDeliveryAvailable = true;
    ctrl = new FormControl<NgbTimeStruct | null>(
        null,
        (control: FormControl<NgbTimeStruct | null>) => {
            const value = control.value;

            if (!value) {
                return null;
            }

            // if (value.hour < 12) {
            // 	return { tooEarly: true };
            // }
            // if (value.hour > 13) {
            // 	return { tooLate: true };
            // }

            return null;
        }
    );
    constructor(
        private orderService: OrderService,
        @Inject(MAT_DIALOG_DATA) public orderData: any,
        private dialogRef: MatDialogRef<AcceptDialogComponent>
    ) {
        this.socket = io(this.socketApiUrl);
    }

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    ngOnInit(): void {
        this.setDefaultTime();
    }
    setDefaultTime() {
        this.ctrl.patchValue({
            hour: 0,
            minute: 20,
            second: 0,
        });
    }
    submitForm() {
        if (!this.ctrl.valid) {
        } else {
            const preprationTime = `${this.ctrl.value.hour}:${this.ctrl.value.minute}`;

            const reqData = {
                orderStatus: "accepted",
                preprationTime: preprationTime,
                cashOnDeliveryAvailable: this.cashOnDeliveryAvailable,
                orderId: this.orderData._id,
            };
            this.orderService.changeOrderStatus(reqData).subscribe({
                next: (res) => {
                    this.socket.emit("orderAcceptedOrRejected", this.orderData);

                    this.dialogRef.close({ successFlag: true });
                },
            });
        }
    }
}
