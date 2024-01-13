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
    constructor(private restaurantService: RestaurantPanelService) {}

    ngOnInit(): void {
        this.getCustomers();
    }

    getCustomers() {
        this.restaurantService.getCustomerList().subscribe({
            next: (res: any) => {
                this.rows = res.data.customers;
                this.customerData = res.data.customers;


                // set the initial value to the loyal and blocked status
                this.rows.forEach((row) => {
                    row.loyal = row.loyal === 1 ? true : false;
                    row.blocked = row.blocked === 1 ? true : false;
                });
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
        const restaurantId = "your_restaurant_id"; // Replace with the actual property holding restaurant ID
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
