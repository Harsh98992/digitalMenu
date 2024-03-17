import { Component, Inject, OnInit } from "@angular/core";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";

@Component({
    selector: "app-confirm-dialog",
    templateUrl: "./confirm-dialog.component.html",
    styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent implements OnInit {
    message = "";
    title = "";
    cancelBtnText = "Cancel";
    successBtnText = "Yes";
    printBill = false;
    constructor(
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        console.log(this.data);
        this.message = this.data.message;
        this.title = this.data.title;
        if (this.data.cancelBtnText) {
            this.cancelBtnText = this.data.cancelBtnText;
        }
        if (this.data.successBtnText) {
            this.successBtnText = this.data.successBtnText;
        }
        if (this.data.printBill) {
            this.printBill = this.data.printBill;
        }
    }
    okAction() {
        this.dialogRef.close({ okFlag: true });
    }
    okActionWithPriniting() {
        this.dialogRef.close({ okFlag: true, printKOT: true });
    }
}
