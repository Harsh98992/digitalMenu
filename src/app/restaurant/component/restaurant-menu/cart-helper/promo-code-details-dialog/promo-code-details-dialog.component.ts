import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-promo-code-details-dialog",
    templateUrl: "./promo-code-details-dialog.component.html",
    styleUrls: ["./promo-code-details-dialog.component.scss"],
})
export class PromoCodeDetailsDialogComponent implements OnInit {
    constructor(
        // Inject the data passed from the parent component
        @Inject(MAT_DIALOG_DATA) public data: any,
        // Inject the dialog reference
        public dialogRef: MatDialogRef<PromoCodeDetailsDialogComponent>
    ) {}

    ngOnInit(): void {}

    // Define a method to close the dialog and return the promo code name
    closeDialog() {
        this.dialogRef.close(this.data.codeName);
    }
}
