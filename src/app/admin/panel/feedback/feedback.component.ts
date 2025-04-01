import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";
import { AuthenticationService } from "src/app/api/authentication.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-feedback",
    templateUrl: "./feedback.component.html",
    styleUrls: ["./feedback.component.scss"],
})
export class FeedbackComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        "emoji",
        "feedbackText",
        "customerName",
        "createdAt",
    ];
    isLoading = true;
    restaurantId: string;
    feedbackStats: any = {};
    totalFeedback = 0;
    averageRating = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // Initialize dataSource with empty array to avoid null errors
    dataSource = new MatTableDataSource<any>([]);

    emojiMap = {
        1: "😡",
        2: "😕",
        3: "😐",
        4: "🙂",
        5: "😄",
    };

    constructor(
        private restaurantService: RestaurantService,
        private authService: AuthenticationService,
        private restaurantPanelService: RestaurantPanelService
    ) {}

    ngOnInit(): void {
        this.loadRestaurantData();
    }

    ngAfterViewInit() {
        // Set paginator and sort after view is initialized
        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    loadRestaurantData() {
        // Get restaurant ID from local storage or service
        const restaurantData = localStorage.getItem("restaurantData");
        if (restaurantData) {
            try {
                const parsedData = JSON.parse(restaurantData);
                if (parsedData && parsedData._id) {
                    this.restaurantId = parsedData._id;
                    console.log("Found restaurant ID:", this.restaurantId);
                    this.loadFeedback();
                    this.loadFeedbackStats();
                } else {
                    console.error("Restaurant data does not contain _id");
                    this.tryAlternativeMethods();
                }
            } catch (e) {
                console.error("Error parsing restaurant data:", e);
                this.tryAlternativeMethods();
            }
        } else {
            console.warn("No restaurant data found in localStorage");
            this.tryAlternativeMethods();
        }
    }

    tryAlternativeMethods() {
        // Method 1: Try to get restaurant ID from URL
        const restaurantIdFromUrl = this.getRestaurantIdFromUrl();
        if (restaurantIdFromUrl) {
            this.restaurantId = restaurantIdFromUrl;
            console.log("Found restaurant ID from URL:", this.restaurantId);
            this.loadFeedback();
            this.loadFeedbackStats();
            return;
        }

        // Method 2: Try to get restaurant ID from authentication service
        const userDetail = this.authService.getUserDetail();
        if (userDetail && userDetail.restaurantId) {
            this.restaurantId = userDetail.restaurantId;
            console.log(
                "Found restaurant ID from auth service:",
                this.restaurantId
            );
            this.loadFeedback();
            this.loadFeedbackStats();
            return;
        }

        // Method 3: Try to get restaurant ID from restaurant panel service
        this.restaurantPanelService.getRestaurnatDetail().subscribe({
            next: (res: any) => {
                if (
                    res &&
                    res.data &&
                    res.data.restaurantDetail &&
                    res.data.restaurantDetail._id
                ) {
                    this.restaurantId = res.data.restaurantDetail._id;
                    console.log(
                        "Found restaurant ID from restaurant panel service:",
                        this.restaurantId
                    );
                    this.loadFeedback();
                    this.loadFeedbackStats();
                } else {
                    // If no restaurant ID is found, use a default one for testing
                    // This is just for demonstration purposes
                    this.restaurantId = "5f9f1b9b9b9b9b9b9b9b9b9b"; // Replace with a valid ID if known
                    console.log(
                        "Using default restaurant ID for testing:",
                        this.restaurantId
                    );
                    this.loadFeedback();
                    this.loadFeedbackStats();
                }
            },
            error: (err) => {
                console.error("Error getting restaurant details:", err);
                // If no restaurant ID is found, use a default one for testing
                this.restaurantId = "5f9f1b9b9b9b9b9b9b9b9b9b"; // Replace with a valid ID if known
                console.log(
                    "Using default restaurant ID for testing:",
                    this.restaurantId
                );
                this.loadFeedback();
                this.loadFeedbackStats();
            },
        });
    }

    getRestaurantIdFromUrl(): string | null {
        // Try to extract restaurant ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const detailParam = urlParams.get("detail");
        if (detailParam) {
            return detailParam;
        }
        return null;
    }

    loadFeedback() {
        if (!this.restaurantId) {
            console.error("Cannot load feedback: Restaurant ID is missing");
            this.isLoading = false;
            return;
        }

        console.log("Loading feedback for restaurant ID:", this.restaurantId);
        this.isLoading = true;

        this.restaurantService
            .getFeedbackByRestaurant(this.restaurantId)
            .subscribe({
                next: (response: any) => {
                    console.log("Feedback response:", response);

                    // Handle case where there's no feedback yet
                    if (
                        !response ||
                        !response.data ||
                        !response.data.feedback
                    ) {
                        console.log("No feedback data available");
                        this.dataSource.data = [];
                        this.isLoading = false;
                        return;
                    }

                    const feedbackData = response.data.feedback.map(
                        (item: any) => {
                            return {
                                ...item,
                                emojiIcon: this.emojiMap[item.emoji] || "😐",
                                customerName:
                                    item.customerInfo?.name || "Anonymous",
                            };
                        }
                    );

                    console.log("Processed feedback data:", feedbackData);
                    this.dataSource.data = feedbackData;

                    // Re-assign paginator and sort in case they were initialized after data was loaded
                    if (this.paginator && this.sort) {
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error("Error loading feedback:", error);
                    this.dataSource.data = [];
                    this.isLoading = false;
                },
            });
    }

    loadFeedbackStats() {
        if (!this.restaurantId) {
            console.error(
                "Cannot load feedback stats: Restaurant ID is missing"
            );
            return;
        }

        console.log(
            "Loading feedback stats for restaurant ID:",
            this.restaurantId
        );

        this.restaurantService.getFeedbackStats(this.restaurantId).subscribe({
            next: (response: any) => {
                console.log("Feedback stats response:", response);

                // Handle case where there's no feedback stats yet
                if (!response || !response.data || !response.data.stats) {
                    console.log("No feedback stats available");
                    this.feedbackStats = {};
                    this.totalFeedback = 0;
                    this.averageRating = 0;
                    return;
                }

                this.feedbackStats = response.data.stats.reduce(
                    (acc: any, curr: any) => {
                        acc[curr._id] = curr.count;
                        return acc;
                    },
                    {}
                );

                this.totalFeedback = response.data.totalFeedback || 0;
                this.averageRating = response.data.averageRating || 0;
                console.log("Processed feedback stats:", this.feedbackStats);
            },
            error: (error) => {
                console.error("Error loading feedback stats:", error);
                this.feedbackStats = {};
                this.totalFeedback = 0;
                this.averageRating = 0;
            },
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getEmojiPercentage(emojiValue: number): number {
        if (!this.totalFeedback) return 0;
        return (
            ((this.feedbackStats[emojiValue] || 0) / this.totalFeedback) * 100
        );
    }
}
