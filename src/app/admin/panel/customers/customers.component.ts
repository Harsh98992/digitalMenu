import { Component, OnInit, ViewChild } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-customers",
    templateUrl: "./customers.component.html",
    styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    rows = [];
    ColumnMode = ColumnMode;
    extraIngredents = [];
    searchTerm = "";
    filteredData: any;
    customerData: any;
    restaurantId: any;

    // Add new properties for filter options
    loyalFilter: string = "";
    blockedFilter: string = "";

    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();
        this.filteredData = this.customerData.filter((row) => {
            const loyalCondition =
                this.loyalFilter === "" ||
                (this.loyalFilter === "true" && row.loyal) ||
                (this.loyalFilter === "false" && !row.loyal);

            const blockedCondition =
                this.blockedFilter === "" ||
                (this.blockedFilter === "true" && row.blocked) ||
                (this.blockedFilter === "false" && !row.blocked);

            const searchCondition = Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );

            return loyalCondition && blockedCondition && searchCondition;
        });
        this.table.offset = 0; // Reset pagination to the first page
    }

    constructor(private restaurantService: RestaurantPanelService) {}

    ngOnInit(): void {
        this.getCustomers();

        this.restaurantService.getRestaurnatDetail().subscribe({
            next: (res: any) => {
                if (res && res.data && res.data.restaurantDetail) {
                    this.restaurantId = res.data.restaurantDetail._id;
                }
            },
        });
    }

    getCustomers() {
        this.restaurantService.getCustomerList().subscribe({
            next: (res: any) => {
                this.rows = res.data.customers;
                this.customerData = res.data.customers;

                // "blockedRestaurants": [
                //     {
                //       "$oid": "6589ac2f70163caea44378d5"
                //     }
                //   ]
                // set the initial value to the loyal and blocked status
                this.rows.forEach((row) => {
                    // loyalRestaurants is an array of restaurant IDs that the customer is loyal to
                    for (const restaurant of row.loyalRestaurants) {
                        if (restaurant.$oid === this.restaurantId) {
                            row.loyal = true;
                            break;
                        }
                    }

                    // blockedRestaurants is an array of restaurant IDs that the customer is blocked from

                    for (const restaurant of row.blockedRestaurants) {
                        if (restaurant.$oid === this.restaurantId) {
                            row.blocked = true;
                            break;
                        }
                    }
                });
            },
        });
    }

    // Add the new methods for toggling loyal and blocked status
    toggleLoyalStatus(row: any): void {
        const customerId = row._id; // Replace with the actual property holding customer ID

        const isLoyal = !row.loyal;

        // Call the API to toggle loyal status
        this.restaurantService
            .toggleLoyalOrBlockStatus("loyal", customerId, isLoyal)
            .subscribe({
                next: (res: any) => {
                    row.loyal = isLoyal;
                },
            });
    }

    toggleBlockedStatus(row: any): void {
        const customerId = row._id; // Replace with the actual property holding customer ID
        const isBlocked = !row.blocked;

        // Call the API to toggle blocked status
        this.restaurantService
            .toggleLoyalOrBlockStatus("block", customerId, isBlocked)
            .subscribe({
                next: (res: any) => {
                    // Update the local data after API success
                    row.blocked = isBlocked;
                },
            });
    }
}
