import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { CustomerService } from "src/app/api/customer.service";
import { UtilService } from "src/app/api/util.service";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";
import { NamePhonenumberForRoomServiceComponent } from "../name-phonenumber-for-room-service/name-phonenumber-for-room-service.component";

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
    customerDetailId: any;
    constructor(
        private fb: FormBuilder,
        private restaurnatService: RestaurantService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        public dialogRef: MatDialogRef<TableNumberDialogComponent>,
        private utilityService: UtilService,
        private customerAuthService: CustomerAuthService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.restaurantData = this.dialogData.restaurantData;
        console.log(this.restaurantData);

        this.customerAuthService.customerDetail.subscribe({
            next: (res) => {
                if (res) {
                    this.customerDetailId = res._id;
                    this.tableData = this.dialogData.tableData;
                } else {
                    // this.userLoginFlag = false;
                }
            },
        });
        this.tableData = this.dialogData.tableData;
    }
    filterTables(event: any) {
        if (event.target.value) {
            this.tableData = this.tableData.filter((table: any) =>
                table.tableName
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase())
            );
        } else {
            this.tableData = this.dialogData.tableData;
        }
    }

    onSubmit(option=null) {
        this.selectedTable=option?.tableName;
        if (!this.selectedTable) {
            this.utilityService.openSnackBar("Please select a table", true);
            return;
        }

        const reqData = {
            tableName: this.selectedTable,
            restaurantId: this.restaurantData._id,
        };
        if (this.restaurantData.byPassAuth) {
            const dial = this.dialog.open(
                NamePhonenumberForRoomServiceComponent,
                {
                    panelClass: "add-item-dialog",
                    data: {
                        selectedTableName: this.selectedTable,
                        takeAway: false,
                    },
                }
            );

            dial.afterClosed().subscribe((re) => {
                if (re?.okFlag) {
                    // Close dialog and pass selectedRoom, name, and phoneNumber to the parent component
                    this.dialogRef.close({
                        selectedTableName: this.selectedTable,
                        name: re?.name,
                        phoneNumber: re?.phoneNumber,
                    });
                }
            });
        } else {
            this.restaurnatService
                .checkDineInTableAvailability(reqData)
                .subscribe({
                    next: (res) => {
                        const confirmDialog = this.dialog.open(
                            ConfirmDialogComponent,
                            {
                                data: {
                                    title: "Place Order",
                                    message: `Place Your Order Now for Table Number ${this.selectedTable}!`,
                                },
                            }
                        );
                        confirmDialog.afterClosed().subscribe((result) => {
                            if (result?.okFlag) {
                                this.dialogRef.close({
                                    selectedTableName: this.selectedTable,
                                });
                            }
                        });
                    },
                });
        }
    }
}
