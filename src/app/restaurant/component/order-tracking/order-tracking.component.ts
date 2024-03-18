import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { PaymentDialogComponent } from "src/app/angular-material/payment-dialog/payment-dialog.component";

@Component({
    selector: "app-order-tracking",
    templateUrl: "./order-tracking.component.html",
    styleUrls: ["./order-tracking.component.scss"],
})
export class OrderTrackingComponent implements OnInit {
    seconds: number = 60; // Initial countdown value
    interval: any;
    orderId = "";
    constructor(private dialog: MatDialog, private route: ActivatedRoute) {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    ngOnInit(): void {
        this.startCountdown();
        this.getOrderId();
    }
    getOrderId() {
        this.route.params.subscribe((params) => {
            this.orderId = params["orderId"]; // 'id' should match the parameter defined in the route
        });
    }

    startCountdown(): void {
        this.interval = setInterval(() => {
            if (this.seconds > 0) {
                this.seconds--;
            } else {
                clearInterval(this.interval);
            }
        }, 1000);
    }
    openDialg() {
        // this.dialog.open(PaymentDialogComponent, {
        //     panelClass: "add-item-dialog",
        //     data: {},
        //     disableClose: true,
        // });
    }
}
