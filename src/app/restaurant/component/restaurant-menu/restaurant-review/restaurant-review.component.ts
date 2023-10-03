import { Component, Input, OnInit } from "@angular/core";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

@Component({
    selector: "app-restaurant-review",
    templateUrl: "./restaurant-review.component.html",
    styleUrls: ["./restaurant-review.component.scss"],
})
export class RestaurantReviewComponent implements OnInit {
    @Input("restaurnatData") restaurnatData;
    @Input("reviews") reviews = [];
    // reviews = [];
    placeId = "";
    constructor(private restaurantService: RestaurantService) {}

    ngOnInit(): void {
        this.getReviews();
    }

    getReviews() {
        this.placeId = this.restaurnatData.placeId ?? "";
        // if (placeId) {
        //     this.restaurantService.getRestaurantReview(placeId).subscribe({
        //         next: (res: any) => {
        //             if (
        //                 res.data &&
        //                 res.data.reviewData &&
        //                 res.data.reviewData.result
        //             ) {
        //                 console.log(res.data.reviewData);

        //                 this.reviews = res.data.reviewData.result.reviews;
        //             }
        //             if (this.restaurnatData.placeId) {
        //                 this.placeId = this.restaurnatData.placeId;
        //             }
        //         },
        //     });
        // }
    }
}
