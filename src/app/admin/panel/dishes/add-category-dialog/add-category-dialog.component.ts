import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-add-category-dialog",
    templateUrl: "./add-category-dialog.component.html",
    styleUrls: ["./add-category-dialog.component.scss"],
})
export class AddCategoryDialogComponent implements OnInit {
    categoryErrorFlag = false;
    category = "";
    categoryPriority: number;
    categoryAvailable: boolean = false; // New boolean field
    timeAvailability = false;
    startTime: any;
    endTime: any;
    constructor(
        private restaurantService: RestaurantPanelService,
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        if (this.data && this.data.categoryName) {
            this.category = this.toTitleCase(this.data.categoryName);
            this.startTime = this.data.startTime;
            this.endTime = this.data.endTime;
            this.categoryAvailable = this.data.categoryAvailable;
            this.categoryPriority = this.data.categoryPriority;
            this.timeAvailability=this.data.timeAvailable ? this.data.timeAvailable:false;
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
        if (!this.timeAvailability) {
            this.startTime = null;
            this.endTime = null;
        } else if (this.timeAvailability && !this.startTime) {
            this.utilService.openSnackBar(
                "Please provide start time!",
                true,
                5000
            );
            return;
        } else if (this.timeAvailability && !this.endTime) {
            this.utilService.openSnackBar(
                "Please provide end time!",
                true,
                5000
            );
            return;
        }
        if (this.data) {
            const reqBody = {
                categoryId: this.data._id,
                categoryName: this.category.toLowerCase(),
                categoryPriority: this.categoryPriority,
                categoryAvailable: this.categoryAvailable, // Include the new field
                startTime: this.startTime,
                endTime: this.endTime,
                timeAvailable: this.timeAvailability,
            };
            this.restaurantService.updateCategory(reqBody).subscribe({
                next: (res) => {
                    this.dialogRef.close({ apiCallFlag: true });
                },
            });
        } else {
            const reqBody = {
                category: this.category.toLowerCase(),
                categoryPriority: this.categoryPriority,
                categoryAvailable: this.categoryAvailable, // Include the new field
                startTime: this.startTime,
                endTime: this.endTime,
                timeAvailable: this.timeAvailability,
            };
            this.restaurantService.addCategory(reqBody).subscribe({
                next: (res) => {
                    this.dialogRef.close({ apiCallFlag: true });
                },
            });
        }
    }
}
