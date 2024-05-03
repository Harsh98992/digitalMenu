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
        this.getOrderId();
    }
    getOrderId() {
        this.route.params.subscribe((params) => {
            this.orderId = params["orderId"]; // 'id' should match the parameter defined in the route
        });
    }
    copyText() {
        var copyText = document.createElement("textarea");
        copyText.value = this.orderId;
        document.body.appendChild(copyText);
        copyText.select();
        document.execCommand("copy");
        document.body.removeChild(copyText);
        alert("order id has been copied!");
    }

    openDialg() {
        // this.dialog.open(PaymentDialogComponent, {
        //     panelClass: "add-item-dialog",
        //     data: {},
        //     disableClose: true,
        // });
    }
}
