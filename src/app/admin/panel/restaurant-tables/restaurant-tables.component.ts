import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { AddTableComponent } from "./add-table/add-table.component";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-restaurant-tables",
    templateUrl: "./restaurant-tables.component.html",
    styleUrls: ["./restaurant-tables.component.scss"],
})
export class RestaurantTablesComponent implements OnInit {
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    rows = [];

    ColumnMode = ColumnMode;
    searchTerm = "";
    filteredData: any;
    columns = [];
    constructor(
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService
    ) {}

    ngOnInit(): void {
        this.getTableData();
        this.initalizeTable();
    }
    initalizeTable() {
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Table Name", prop: "tableName" },
            { name: "Capacity", prop: "capacity" },
            { name: "Available", prop: "isAvailable" },
        ];
    }
    getTableData() {
        this.restaurantService.getAllTables().subscribe({
            next: (res: any) => {
                if (res && res.data) {
                    this.rows = res.data.tables.tables;
                }
            },
        });
    }
    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();

        this.filteredData = this.rows.filter((row) => {
            return Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );
        });
        this.table.offset = 0; // Reset pagination to the first page
    }
    deleteTableDialog(row) {
        const dialogData = {
            title: "Confirm",
            message: "Are you sure you want to delete this item?",
        };
        this.dialog
            .open(ConfirmDialogComponent, { data: dialogData })
            .afterClosed()
            .subscribe({
                next: (res: any) => {
                    if (res && res.okFlag) {
                        this.restaurantService
                            .deleteTableById(row._id)
                            .subscribe({
                                next: (res) => {
                                    this.getTableData();
                                },
                            });
                    }
                },
            });
    }
    openAddTableDialog(row) {
        let dialogRef = this.dialog.open(AddTableComponent, {
            disableClose: true,
            panelClass: "app-full-bleed-dialog",

            data: row,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.apiCallFlag) {
                this.getTableData();
            }
        });
    }
}
