import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

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

    constructor(private restaurantService: RestaurantService) {}

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
            const parsedData = JSON.parse(restaurantData);
            this.restaurantId = parsedData._id;
            this.loadFeedback();
            this.loadFeedbackStats();
        }
    }

    loadFeedback() {
        this.isLoading = true;
        this.restaurantService
            .getFeedbackByRestaurant(this.restaurantId)
            .subscribe({
                next: (response: any) => {
                    // Handle case where there's no feedback yet
                    if (!response.data || !response.data.feedback) {
                        this.isLoading = false;
                        return;
                    }

                    const feedbackData = response.data.feedback.map((item) => {
                        return {
                            ...item,
                            emojiIcon: this.emojiMap[item.emoji],
                            customerName:
                                item.customerInfo?.name || "Anonymous",
                        };
                    });

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
                    this.isLoading = false;
                },
            });
    }

    loadFeedbackStats() {
        this.restaurantService.getFeedbackStats(this.restaurantId).subscribe({
            next: (response: any) => {
                // Handle case where there's no feedback stats yet
                if (!response.data || !response.data.stats) {
                    return;
                }

                this.feedbackStats = response.data.stats.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {});

                this.totalFeedback = response.data.totalFeedback || 0;
                this.averageRating = response.data.averageRating || 0;
            },
            error: (error) => {
                console.error("Error loading feedback stats:", error);
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
