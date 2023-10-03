import { Component, OnInit, ViewChild } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { AddCategoryDialogComponent } from "../add-category-dialog/add-category-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-categories",
    templateUrl: "./categories.component.html",
    styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    rows = [];
    ColumnMode = ColumnMode;
    columns = [];
    extraIngredents = [];
    searchTerm = "";
    filteredData: any;
    constructor(
        private restaurantPanelService: RestaurantPanelService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Category Name", prop: "categoryName" },
            { name: "Category Id", prop: "_id" },
        ];
        this.getCategories();
    }
    getCategories() {
        this.restaurantPanelService.getCategory().subscribe({
            next: (res: any) => {
                if (res && res?.data?.category) {
                    this.rows = res.data.category;
                    this.applyFilter();
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
    deleteCategory(row) {
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
                        this.restaurantPanelService
                            .deleteCategory(row._id)
                            .subscribe({
                                next: (res) => {
                                    this.restaurantPanelService.setRestaurantData();
                                    this.getCategories()
                                  
                                },
                            });
                    }
                },
            });
    }
    openCategoryDialog(row) {
        let dialogRef = this.dialog.open(AddCategoryDialogComponent, {
            disableClose: true,
            panelClass: "app-full-bleed-dialog",
            minWidth: "500px",
            data: row,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.apiCallFlag) {
                this.getCategories();
            }
        });
    }
}
