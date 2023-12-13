import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-add-category-dialog",
    templateUrl: "./add-category-dialog.component.html",
    styleUrls: ["./add-category-dialog.component.scss"],
})
export class AddCategoryDialogComponent implements OnInit {
    categoryErrorFlag = false;
    category = "";
    categoryPriority: number;

    constructor(
        private restaurantService: RestaurantPanelService,
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        if (this.data && this.data.categoryName) {
            this.category = this.toTitleCase(this.data.categoryName);
        }
    }

    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    changeCategoryFlag() {
        this.categoryErrorFlag = false;
    }

    addCategory() {
        this.categoryErrorFlag = false;
        if (!this.category) {
            this.categoryErrorFlag = true;
            return;
        }
        if (this.data) {
            const reqBody = {
                categoryId: this.data._id,
                categoryName: this.category.toLowerCase(),
                categoryPriority: this.categoryPriority,
            };
            this.restaurantService.updateCategory(reqBody).subscribe({
                next: (res) => {
                    this.dialogRef.close({ apiCallFlag: true });
                },
            });
        } else {
            this.restaurantService
                .addCategory(this.category.toLowerCase(), this.categoryPriority)
                .subscribe({
                    next: (res) => {
                        this.dialogRef.close({ apiCallFlag: true });
                    },
                });
        }
    }
}
