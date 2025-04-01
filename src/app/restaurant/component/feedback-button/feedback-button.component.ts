import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FeedbackDialogComponent } from "../feedback-dialog/feedback-dialog.component";
import { RestaurantService } from "../../api/restaurant.service";

@Component({
    selector: "app-feedback-button",
    templateUrl: "./feedback-button.component.html",
    styleUrls: ["./feedback-button.component.scss"],
})
export class FeedbackButtonComponent implements OnInit {
    restaurantId: string;

    constructor(
        private dialog: MatDialog,
        private restaurantService: RestaurantService
    ) {}

    ngOnInit(): void {
        // Get the current restaurant URL from the service
        const restaurantUrl = this.restaurantService.getRestaurantUrl();

        if (restaurantUrl) {
            // Get the restaurant data using the URL
            this.restaurantService.getRestaurantData(restaurantUrl).subscribe({
                next: (res: any) => {
                    if (res && res.data && res.data._id) {
                        this.restaurantId = res.data._id;
                    }
                },
                error: (err) => {
                    console.error("Error fetching restaurant data:", err);
                },
            });
        } else {
            console.warn("Restaurant URL not available");
        }
    }

    openFeedbackDialog(): void {
        if (!this.restaurantId) {
            console.error(
                "Cannot open feedback dialog: Restaurant ID not available"
            );
            return;
        }

        const dialogRef = this.dialog.open(FeedbackDialogComponent, {
            width: "350px",
            data: { restaurantId: this.restaurantId },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // Handle any post-dialog actions if needed
        });
    }
}
