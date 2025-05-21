import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";
import { AddRoomCustomerLinkComponent } from "./add-room-customer-link/add-room-customer-link.component";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-room-customer-link",
    templateUrl: "./room-customer-link.component.html",
    styleUrls: ["./room-customer-link.component.scss"],
})
export class RoomCustomerLinkComponent implements OnInit {
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    rows = [];
    ColumnMode = ColumnMode;
    searchTerm = "";
    filteredData: any;
    columns = [];

    constructor(
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.getActiveLinks();
        this.initializeTable();
    }

    initializeTable() {
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Room Name", prop: "roomName" },
            { name: "Customer Phone", prop: "customerPhoneNumber" },
            { name: "Customer Name", prop: "customerName" },
            { name: "Created", prop: "createdAt" },
            { name: "Expires", prop: "expiresAt" },
            { name: "Status", prop: "status" },
        ];
    }

    getActiveLinks() {
        this.restaurantService.getActiveRoomCustomerLinks().subscribe({
            next: (res: any) => {
                if (res && res.data && res.data.links) {
                    this.rows = res.data.links.map((link) => {
                        // Format dates for display
                        const createdDate = new Date(link.createdAt);
                        const expiresDate = new Date(link.expiresAt);

                        // Generate the ordering URL for each link using phone number and room name
                        const orderingUrl = this.generateOrderingUrl(link);

                        return {
                            ...link,
                            createdAt: createdDate.toLocaleString(),
                            expiresAt: expiresDate.toLocaleString(),
                            status: link.notificationSent
                                ? "Notification Sent"
                                : "Pending Notification",
                            orderingUrl: orderingUrl,
                        };
                    });
                    this.applyFilter();
                }
            },
            error: (err) => {
                console.error("Error fetching room-customer links:", err);
            },
        });
    }

    // Generate ordering URL based on phone number and room name
    generateOrderingUrl(link: any): string {
        // Get the current hostname
        const hostname = window.location.origin;
        // Get the restaurant URL from the service
        let restaurantUrl = "";

        // Use type assertion to tell TypeScript about the expected structure
        this.restaurantService.restaurantData.subscribe((data: any) => {
            if (data && data.restaurantUrl) {
                restaurantUrl = data.restaurantUrl;
            }
        });

        // Construct the ordering URL with phone number and room name
        return `${hostname}/restaurant?detail=${restaurantUrl}&phoneNumber=${encodeURIComponent(
            link.customerPhoneNumber
        )}&roomName=${encodeURIComponent(link.roomName)}`;
    }

    // Copy the ordering URL to clipboard
    copyLinkToClipboard(orderingUrl: string) {
        // Create a temporary input element
        const tempInput = document.createElement("input");
        tempInput.value = orderingUrl;
        document.body.appendChild(tempInput);

        // Select the text and copy it
        tempInput.select();
        document.execCommand("copy");

        // Remove the temporary element
        document.body.removeChild(tempInput);

        // Show a success message
        this.utilService.openSnackBar("Link copied to clipboard!", false);
    }

    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();

        this.filteredData = this.rows.filter((row) => {
            return Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );
        });

        if (this.table) {
            this.table.offset = 0; // Reset pagination to the first page
        }
    }

    openAddLinkDialog() {
        const dialogRef = this.dialog.open(AddRoomCustomerLinkComponent, {
            disableClose: true,
            panelClass: "app-full-bleed-dialog",
            width: "500px",
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.success) {
                this.getActiveLinks();
            }
        });
    }

    deactivateLink(linkId: string) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: "Confirm Deactivation",
                message:
                    "Are you sure you want to deactivate this room-customer link?",
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.restaurantService
                    .deactivateRoomCustomerLink(linkId)
                    .subscribe({
                        next: () => {
                            this.getActiveLinks();
                        },
                        error: (err) => {
                            console.error("Error deactivating link:", err);
                        },
                    });
            }
        });
    }

    resendNotification(linkId: string) {
        this.restaurantService
            .resendRoomCustomerLinkNotification(linkId)
            .subscribe({
                next: () => {
                    // Update the list to reflect the notification status change
                    this.getActiveLinks();
                },
                error: (err) => {
                    console.error("Error resending notification:", err);
                },
            });
    }
}
