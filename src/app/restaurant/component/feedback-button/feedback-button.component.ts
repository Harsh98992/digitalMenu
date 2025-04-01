import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
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
        private restaurantService: RestaurantService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.getRestaurantIdFromUrl();
    }

    /**
     * Try multiple methods to get the restaurant ID
     */
    getRestaurantIdFromUrl(): void {
        // Method 1: Get from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const detailParam = urlParams.get("detail");

        if (detailParam) {
            // If we have a detail parameter in the URL, use it to get restaurant data
            this.restaurantService.getRestaurantData(detailParam).subscribe({
                next: (res: any) => {
                    if (res && res.data && res.data._id) {
                        this.restaurantId = res.data._id;
                        console.log(
                            "Restaurant ID found from URL parameter:",
                            this.restaurantId
                        );
                    }
                },
                error: (err) => {
                    console.error(
                        "Error fetching restaurant data from URL parameter:",
                        err
                    );
                    this.tryAlternativeMethods();
                },
            });
        } else {
            // Try alternative methods if no detail parameter
            this.tryAlternativeMethods();
        }
    }

    /**
     * Try alternative methods to get the restaurant ID
     */
    tryAlternativeMethods(): void {
        // Method 2: Get from localStorage via service
        const restaurantUrl = this.restaurantService.getRestaurantUrl();

        if (restaurantUrl) {
            this.restaurantService.getRestaurantData(restaurantUrl).subscribe({
                next: (res: any) => {
                    if (res && res.data && res.data._id) {
                        this.restaurantId = res.data._id;
                        console.log(
                            "Restaurant ID found from localStorage:",
                            this.restaurantId
                        );
                    }
                },
                error: (err) => {
                    console.error(
                        "Error fetching restaurant data from localStorage:",
                        err
                    );
                    this.tryCartStateMethod();
                },
            });
        } else {
            // Try the cart state method if no restaurant URL in localStorage
            this.tryCartStateMethod();
        }
    }

    /**
     * Try to get restaurant ID from cart state
     */
    tryCartStateMethod(): void {
        // Method 3: Try to get from cart state
        const cartState = localStorage.getItem("cartState");

        if (cartState) {
            try {
                const parsedCartState = JSON.parse(cartState);
                if (parsedCartState && parsedCartState.restaurantId) {
                    this.restaurantId = parsedCartState.restaurantId;
                    console.log(
                        "Restaurant ID found from cart state:",
                        this.restaurantId
                    );
                } else {
                    // Try to extract from URL path if no restaurant ID in cart state
                    this.tryExtractFromPath();
                }
            } catch (e) {
                console.error("Error parsing cart state:", e);
                // Try to extract from URL path if error parsing cart state
                this.tryExtractFromPath();
            }
        } else {
            // Method 4: Try to extract from URL path
            this.tryExtractFromPath();
        }
    }

    /**
     * Try to extract restaurant ID from URL path
     */
    tryExtractFromPath(): void {
        // Get the current path
        const path = window.location.pathname;

        // Check if we're in a restaurant path
        if (path.includes("/restaurant/")) {
            // Extract the restaurant identifier from the path
            const pathParts = path.split("/");
            const restaurantIdentifier = pathParts[pathParts.length - 1];

            if (restaurantIdentifier) {
                // Try to get restaurant data using this identifier
                this.restaurantService
                    .getRestaurantData(restaurantIdentifier)
                    .subscribe({
                        next: (res: any) => {
                            if (res && res.data && res.data._id) {
                                this.restaurantId = res.data._id;
                                console.log(
                                    "Restaurant ID found from URL path:",
                                    this.restaurantId
                                );
                            } else {
                                console.warn(
                                    "Could not determine restaurant ID from any source"
                                );
                            }
                        },
                        error: (err) => {
                            console.error(
                                "Error fetching restaurant data from URL path:",
                                err
                            );
                            console.warn(
                                "Could not determine restaurant ID from any source"
                            );
                        },
                    });
            } else {
                console.warn(
                    "Could not determine restaurant ID from any source"
                );
            }
        } else {
            // Last resort: Try to get the restaurant ID from the document title
            this.tryGetFromTitle();
        }
    }

    /**
     * Last resort method to try to get restaurant ID from document title
     */
    tryGetFromTitle(): void {
        const title = document.title;
        if (title && title.includes("QRSay")) {
            // Try to extract restaurant name from title
            const restaurantName = title.replace("QRSay - ", "").trim();
            if (restaurantName) {
                try {
                    // Make a search request to find the restaurant
                    this.restaurantService
                        .searchRestaurants(restaurantName)
                        .subscribe({
                            next: (res: any) => {
                                if (
                                    res &&
                                    res.data &&
                                    res.data.length > 0 &&
                                    res.data[0]._id
                                ) {
                                    this.restaurantId = res.data[0]._id;
                                    console.log(
                                        "Restaurant ID found from title search:",
                                        this.restaurantId
                                    );
                                } else {
                                    console.warn(
                                        "Could not determine restaurant ID from any source"
                                    );
                                }
                            },
                            error: (err) => {
                                console.error(
                                    "Error searching for restaurant:",
                                    err
                                );
                                console.warn(
                                    "Could not determine restaurant ID from any source"
                                );
                            },
                        });
                } catch (e) {
                    console.error("Error calling search API:", e);
                    console.warn(
                        "Could not determine restaurant ID from any source"
                    );
                }
            } else {
                console.warn(
                    "Could not determine restaurant ID from any source"
                );
            }
        } else {
            console.warn("Could not determine restaurant ID from any source");
        }
    }

    openFeedbackDialog(): void {
        // If restaurant ID is not available, try one more time with all methods
        if (!this.restaurantId) {
            console.warn(
                "Restaurant ID not available, trying to get it one more time"
            );

            // Try all methods one more time
            this.getRestaurantIdFromUrl();

            // Check if we got the restaurant ID
            setTimeout(() => {
                if (!this.restaurantId) {
                    console.error(
                        "Cannot open feedback dialog: Restaurant ID not available"
                    );
                    this.snackBar.open(
                        "Cannot provide feedback at this time. Please try again later.",
                        "Close",
                        { duration: 3000 }
                    );
                } else {
                    // We got the restaurant ID, open the dialog
                    this.openFeedbackDialogWithId();
                }
            }, 1000); // Wait 1 second for async operations to complete

            return;
        }

        // If we have the restaurant ID, open the dialog
        this.openFeedbackDialogWithId();
    }

    /**
     * Open the feedback dialog with the restaurant ID
     */
    private openFeedbackDialogWithId(): void {
        const dialogRef = this.dialog.open(FeedbackDialogComponent, {
            width: "350px",
            data: { restaurantId: this.restaurantId },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // Handle any post-dialog actions if needed
        });
    }
}
