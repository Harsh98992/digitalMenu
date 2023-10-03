import { Component, OnInit, ViewChild } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-customers",
    templateUrl: "./customers.component.html",
    styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
    @ViewChild('myTable', { static: false }) table: DatatableComponent;
    rows = [];
    ColumnMode = ColumnMode;
    extraIngredents = [];
    searchTerm = '';
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
                this.customerData=res.data.customers
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
}
