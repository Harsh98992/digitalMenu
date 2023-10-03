import { Component, OnInit } from "@angular/core";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-promo-code-list",
    templateUrl: "./promo-code-list.component.html",
    styleUrls: ["./promo-code-list.component.scss"],
})
export class PromoCodeListComponent implements OnInit {
    promoCodes: any;
    columns: any[] = [
        { prop: "codeName", name: "Code Name" },
        { prop: "discountType", name: "Discount Type" },
        { prop: "discountAmount", name: "Discount Amount" },
        { prop: "minOrderValue", name: "Min Order Value" },
        { prop: "startDate", name: "Start Date" },
        { prop: "endDate", name: "End Date" },
        { prop: "active", name: "Active" },
        { prop: "usedCount", name: "Used Count" },
        { prop: "totalUsageLimit", name: "Total Usage Limit" },
        { prop: "perUserLimit", name: "Per User Limit" },
        { prop: "applicableFor", name: "Applicable For" },
        { prop: "mealTime", name: "Meal Time" },
        { prop: "days", name: "Day Of Week" },
        { prop: "maxDiscount", name: "Max Discount" },
        { prop: "action", name: "Action" },
    ];

    constructor(
        private restaurantService: RestaurantPanelService,
        private utilService: UtilService
    ) {}

    ngOnInit() {
        this.loadPromoCodes();
    }

    loadPromoCodes() {
        this.restaurantService.getPromoCode().subscribe(
            (res) => {
                this.promoCodes = res["data"]["promoCodes"];

                console.log(this.promoCodes);

                // Get all the keys of the last object in the array
            },
            (error) => {
                console.error(error);
                // Handle error if needed
            }
        );
    }
}
