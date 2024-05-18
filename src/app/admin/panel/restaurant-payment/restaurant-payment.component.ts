import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { PaymentDetailDialogComponent } from "src/app/angular-material/payment-detail-dialog/payment-detail-dialog.component";
import { TansferDetailDialogComponent } from "src/app/angular-material/tansfer-detail-dialog/tansfer-detail-dialog.component";
import { AdminPanelService } from "src/app/api/admin-panel.service";

@Component({
    selector: "app-restaurant-payment",
    templateUrl: "./restaurant-payment.component.html",
    styleUrls: ["./restaurant-payment.component.scss"],
})
export class RestaurantPaymentComponent implements OnInit {
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
    startDate;
    endDate;
    constructor(
        private adminService: AdminPanelService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getPayments();
        this.applyColumn();
    }
    applyColumn() {
        this.columns = [
            { name: "Action", prop: "action" },
            { name: "Order Id", prop: "order_id" },
            { name: "Payment Id", prop: "id" },
            { name: "Amount", prop: "amount" },
            { name: "Status", prop: "status" },
            { name: "Method", prop: "method" },
            { name: "Contact", prop: "contact" },
            { name: "Date & Time", prop: "created_at" },
        ];
    }
    getPayments() {
        this.adminService.getRestaurantPayment().subscribe((res: any) => {
            if (res) {
                this.rows = res.data;
                this.applyFilter();
            }
        });
    }
    viewTransferDetails(row) {
        if (row) {
            this.adminService
                .getAccountTransferDetails(row.order_id)
                .subscribe((res: any) => {
                    if (res && res.data?.length) {
                        const passedData = {
                            transferId: res.data[0].id,
                            tansferProcessAt: res.data[0].processed_at,

                            tansferCreatedAt: res.data[0].created_at,
                            status: res.data[0].status,
                            recipient_settlement_id:
                                res.data[0].recipient_settlement_id,
                            settlement_status: res.data[0].settlement_status,
                            orderId: row.order_id,
                            paymentId: row.id,
                        };

                        this.openTransferDetails(passedData);
                    }
                });
        }
    }
    openTransferDetails(data: any) {
        let dialogRef = this.dialog.open(TansferDetailDialogComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
            data,
        });
    }
    applyFilter(event: Date = null, str = ""): void {
        const filterValue = this.searchTerm.toLowerCase();

        this.filteredData = this.rows.filter((row) => {
            return Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );
        });
        this.table.offset = 0; // Reset pagination to the first page
        if (event && event?.getTime()) {
            if (str == "startDate") {
                this.filteredData = this.filteredData.filter((row) => {
                    return new Date(row.created_at * 1000) >= new Date(event);
                });
            } else {
                this.filteredData = this.filteredData.filter((row) => {
                    return new Date(row.created_at * 1000) <= new Date(event);
                });
            }
        }
    }
    reset() {
        this.searchTerm = "";
        this.startDate = null;
        this.endDate = null;
        this.applyFilter();
    }
}
