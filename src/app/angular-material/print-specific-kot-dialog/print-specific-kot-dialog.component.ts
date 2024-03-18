import { Component, Inject, OnInit } from "@angular/core";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { UtilService } from "src/app/api/util.service";
const _ = require("lodash");
@Component({
    selector: "app-print-specific-kot-dialog",
    templateUrl: "./print-specific-kot-dialog.component.html",
    styleUrls: ["./print-specific-kot-dialog.component.scss"],
})
export class PrintSpecificKotDialogComponent implements OnInit {
    kotData = null;
    kotSelected = null;
    constructor(
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        public dialogRef: MatDialogRef<PrintSpecificKotDialogComponent>,
        private utilServie: UtilService
    ) {}

    ngOnInit(): void {
        this.kotData = _.cloneDeep(this.dialogData);
        this.kotData.orderDetails = this.kotData.orderDetails?.reverse();
        console.log(this.kotData);
    }
    onSubmit() {
        if (!this.kotSelected) {
            this.utilServie.openSnackBar("Please select a KOT", true);
            return;
        }
        if (this.kotSelected === "all") {
            this.dialogRef.close(this.dialogData);
            return;
        } else {
            const reqData = _.cloneDeep(this.dialogData);
            reqData["orderDetails"] = [this.kotSelected];

            this.dialogRef.close(reqData);
        }
    }
}
