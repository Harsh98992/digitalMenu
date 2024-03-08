import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UtilService } from "src/app/api/util.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

@Component({
    selector: "app-table-number-dialog",
    templateUrl: "./table-number-dialog.component.html",
    styleUrls: ["./table-number-dialog.component.scss"],
})
export class TableNumberDialogComponent implements OnInit {
    form: FormGroup;
    restaurantData: any;
    tableData: any;
    selectedTable: any;
    constructor(
        private fb: FormBuilder,
        private restaurnatService: RestaurantService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        public dialogRef: MatDialogRef<TableNumberDialogComponent>,
        private utilityService: UtilService
    ) {}

    ngOnInit(): void {
        this.restaurantData = this.dialogData.restaurantData;
        this.tableData = this.dialogData.tableData;
        console.log(this.tableData);
    }

    onSubmit() {
        if (!this.selectedTable) {
            this.utilityService.openSnackBar("Please select a table", true);
            return;
        }

        const reqData = {
            tableName: this.selectedTable,
            restaurantId: this.restaurantData._id,
        };
        this.restaurnatService.checkDineInTableAvailability(reqData).subscribe({
            next: (res) => {
                this.dialogRef.close({
                    selectedTableName: this.selectedTable,
                });
            },
        });
    }
}
