import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-tansfer-detail-dialog",
    templateUrl: "./tansfer-detail-dialog.component.html",
    styleUrls: ["./tansfer-detail-dialog.component.scss"],
})
export class TansferDetailDialogComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public details: any
    ) {}

    ngOnInit(): void {
      console.log(this.details);
      
    }
}
