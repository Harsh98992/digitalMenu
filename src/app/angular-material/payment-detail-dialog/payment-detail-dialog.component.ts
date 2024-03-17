import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-payment-detail-dialog",
    templateUrl: "./payment-detail-dialog.component.html",
    styleUrls: ["./payment-detail-dialog.component.scss"],
})
export class PaymentDetailDialogComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public details: any
    ) {}

    ngOnInit(): void {}
}
