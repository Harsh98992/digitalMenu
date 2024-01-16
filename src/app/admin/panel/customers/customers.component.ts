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
    restaurantId : any;


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


                // set the initial value to the loyal and blocked status
                this.rows.forEach((row) => {
                   // loyalRestaurants is an array of restaurant IDs that the customer is loyal to
                    row.loyal = row.loyalRestaurants.includes(this.restaurantId);
                    row.blocked = row.blockedRestaurants.includes(this.restaurantId);
                }
                );
            },
        });
    }
    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();
        console.log(filterValue);

        this.filteredData = this.customerData.filter((row) => {
            return Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );
        });
        this.table.offset = 0; // Reset pagination to the first page
    }

    // Add the new methods for toggling loyal and blocked status
    toggleLoyalStatus(row: any): void {
        const customerId = row.id; // Replace with the actual property holding customer ID

        const isLoyal = !row.loyal;

        // Call the API to toggle loyal status
        this.restaurantService
            .toggleLoyalStatus(customerId, isLoyal)
            .subscribe({
                next: (res: any) => {
                    // Update the local data after API success
                    row.loyal = isLoyal;
                },
            });
    }

    toggleBlockedStatus(row: any): void {
        const customerId = row.id; // Replace with the actual property holding customer ID
        const restaurantId = "your_restaurant_id"; // Replace with the actual property holding restaurant ID
        const isBlocked = !row.blocked;

        // Call the API to toggle blocked status
        this.restaurantService
            .toggleBlockedStatus(customerId, isBlocked)
            .subscribe({
                next: (res: any) => {
                    // Update the local data after API success
                    row.blocked = isBlocked;
                },
            });
    }
}
