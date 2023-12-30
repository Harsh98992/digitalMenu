import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { Subject, takeUntil } from "rxjs";
import { io } from "socket.io-client";
import { OrderService } from "src/app/api/order.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-accept-dialog",
    templateUrl: "./accept-dialog.component.html",
    styleUrls: ["./accept-dialog.component.scss"],
})
export class AcceptDialogComponent implements OnInit, OnDestroy {
    //  time=['15 min','30 min','45 min','1 hour','1 hour 15 min','1 hour 30 min'],
    destroy$: Subject<boolean> = new Subject<boolean>();
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
    paymentGatewayFlag: boolean;
    constructor(
        private orderService: OrderService,
        @Inject(MAT_DIALOG_DATA) public orderData: any,
        private restaurantService: RestaurantPanelService,
        private dialogRef: MatDialogRef<AcceptDialogComponent>
    ) {
        this.socket = io(this.socketApiUrl);
    }
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    socket: any;
    socketApiUrl = environment.socketApiUrl;

    ngOnInit(): void {
        this.setDefaultTime();
        this.getRestaurantData();
    }
    getRestaurantData() {
        this.restaurantService.restaurantData
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    if (res?.paymentgatewayData?.gatewayData) {
                        this.paymentGatewayFlag = true;
                    }
                },
            });
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
