import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { OrderService } from "src/app/api/order.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { OrderAcceptDialogComponent } from "../../../angular-material/order-accept-dialog/order-accept-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { io } from "socket.io-client";
import { environment } from "src/environments/environment";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";

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
    selectedOption = "all";
    extraIngredents = [];
    searchTerm = "";
    filteredData: any;
    socket: any;
    socketApiUrl = environment.socketApiUrl;

    constructor(
        private restaurantService: RestaurantPanelService,
        private router: Router,
        private orderService: OrderService,
        private dialog: MatDialog,
        private customerAuthService: CustomerAuthService
    ) {}

    ngOnInit(): void {
        this.changeStatus();

        // run the change status function every 10 seconds
        // setInterval(() => {
        //     this.changeStatus();
        // }, 5000);
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
        row["completeScreen"] = true;
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

                    // reverse the array
                    this.rows = this.rows.reverse();
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
