import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { Subject, takeUntil } from "rxjs";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-view-dish",
    templateUrl: "./view-dish.component.html",
    styleUrls: ["./view-dish.component.scss"],
})
export class ViewDishComponent implements OnInit {
    @ViewChild("editTmpl", { static: true }) editTmpl: TemplateRef<any>;
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    rows = [];
    columns = [];
    ColumnMode = ColumnMode;
    destroy$: Subject<boolean> = new Subject<boolean>();
    searchTerm = "";
    filteredData: any;
    constructor(
        private restaurantService: RestaurantPanelService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getOrders();
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Dish Image", prop: "imageUrl" },
            { name: "Dish Name", prop: "dishName" },
            { name: "Price", prop: "dishPrice" },
            { name: "Dish Type", prop: "dishType" },
            { name: "Availability", prop: "availableFlag" },
            { name: "Dish Order Option", prop: "dishOrderOption" },

            { name: "Dish Description", prop: "dishDescription" },
            { name: "Spicy", prop: "chilliFlag" },
        ];
    }
    outOfStockDish(row) {
        const reqBody = Object.assign({}, row);
        reqBody["dishOrderOption"] = "none";
        reqBody["availableFlag"] = false;
        reqBody["dishId"] = row["_id"];
        reqBody["previousDishCategory"] = row["categoryId"];
        reqBody["dishCategory"] = row["categoryId"];
        reqBody["spicy"] = row["chilliFlag"];
        this.restaurantService.editDish(reqBody).subscribe({
            next: (res) => {
                this.restaurantService.setRestaurantData(res);
                this.router.navigateByUrl("/admin/dishes/view-dish");
            },
        });
    }
    getOrders() {
        this.restaurantService.restaurantData
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    if (res && res.cuisine) {
                        const dishes = this.getAllDishes(res?.cuisine);

                        this.rows = dishes;
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
    navigateToEditDish(row: any) {
        this.restaurantService.setSelectedDish(row);
        this.router.navigate(["/admin/dishes/add-dish"], {
            queryParams: { edit: true },
        });
    }
    // Inside your ViewDishComponent class in view-dish.component.ts

    // ...

    getAllDishes(cuisine) {
        const result = [];

        // Create a mapping between categoryId and category value
        const categoryMap = {};
        if (cuisine) {
            for (let dish of cuisine) {
                categoryMap[dish["_id"]] = dish["categoryName"]; // Assuming categoryName is the property holding the category value
                if (dish["items"] && dish["items"].length) {
                    console.log(dish["items"]);
                    const newArray = dish["items"].map((obj) => ({
                        ...obj,
                        categoryId: dish["_id"],
                    }));
                    result.push(...newArray);
                }
            }
        }

        // Sort the result array by category value
        result.sort((a, b) =>
            categoryMap[a.categoryId] > categoryMap[b.categoryId] ? 1 : -1
        );

        return result;
    }

    // ...
    deleteDish(row: any) {
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
                            .deleteDish(row._id, { categoryId: row.categoryId })
                            .subscribe({
                                next: (res) => {
                                    this.restaurantService.setRestaurantData(
                                        res
                                    );
                                },
                            });
                    }
                },
            });
    }

    // navigateToOrderView(row) {
    //   this.router.navigateByUrl('/admin/restaurant-orders/view');
    // }
}
