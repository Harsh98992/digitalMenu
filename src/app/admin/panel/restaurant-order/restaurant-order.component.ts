import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { OrderService } from "src/app/api/order.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { OrderAcceptDialogComponent } from "../../../angular-material/order-accept-dialog/order-accept-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-restaurant-order",
    templateUrl: "./restaurant-order.component.html",
    styleUrls: ["./restaurant-order.component.scss"],
})
export class RestaurantOrderComponent implements OnInit {
    @ViewChild("editTmpl", { static: true }) editTmpl: TemplateRef<any>;
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    rows = [];
    columns = [];
    ColumnMode = ColumnMode;
    statusOption = [];
    selectedOption = "completed";
    extraIngredents = [];
    searchTerm = "";
    filteredData: any;
    constructor(
        private restaurantService: RestaurantPanelService,
        private router: Router,
        private orderService: OrderService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getOrders();
        this.applyColumn();
    }

    applyColumn() {
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Order Id", prop: "orderId" },
            { name: "Order Status", prop: "orderStatus" },
            { name: "Customer Name", prop: "customerName" },
            { name: "Customer Email", prop: "customerEmail" },
            { name: "Customer Phone Number", prop: "customerPhoneNumber" },
            { name: "Customer Preferences", prop: "customerPreferences" },
            { name: "Order Date", prop: "orderDate" },
            { name: "Order Total", prop: "orderTotal" },
        ];
    }
    changeStatus() {
        console.log(this.selectedOption);

        if (this.selectedOption) {
            if (this.selectedOption === "all") {
                this.getOrders([
                    "pending",
                    "completed",
                    "rejected",
                    "processing",
                ]);
            } else {
                this.getOrders([this.selectedOption]);
            }
        }
    }
    viewOrder(row) {
        this.dialog
            .open(OrderAcceptDialogComponent, {
                minWidth: "90vw",
                data: row,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    this.getOrders();
                }
            });
    }
    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();

        this.filteredData = this.rows.filter((row) => {
            return Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );
        });
        this.table.offset = 0; // Reset pagination to the first page
    }
    getOrders(status = ["completed"]) {
        // this.restaurantService.getResataurantOrder().subscribe({
        //   next: (res: any) => {
        //     console.log(res);

        //     this.rows = res;
        //   },
        // });
        const reqData = {
            orderStatus: status,
        };
        this.orderService.getRestaurantOrdersByStatus(reqData).subscribe({
            next: (res: any) => {
                if (res?.data?.orderData) {
                    this.rows = res.data.orderData;
                    this.applyFilter();
                } else {
                    this.filteredData = [];
                    this.rows = [];
                }
            },
        });
    }
    navigateToOrderView(row) {
        this.router.navigateByUrl("/admin/restaurant-orders/view");
    }
}
