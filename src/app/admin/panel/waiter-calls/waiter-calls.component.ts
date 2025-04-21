import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { environment } from "src/environments/environment";
import { io } from "socket.io-client";
import { Subscription } from "rxjs";

@Component({
    selector: "app-waiter-calls",
    templateUrl: "./waiter-calls.component.html",
    styleUrls: ["./waiter-calls.component.scss"],
})
export class WaiterCallsComponent implements OnInit, OnDestroy {
    rows = [];
    filteredData: any;
    columns = [];
    ColumnMode = ColumnMode;
    searchTerm = "";
    socket: any;
    socketApiUrl = environment.socketApiUrl;
    restaurantId: string;
    private socketSubscription: Subscription;

    constructor(
        private restaurantService: RestaurantPanelService,
        public dialog: MatDialog
    ) {
        this.socket = io(this.socketApiUrl);
    }

    ngOnInit(): void {
        this.initializeTable();
        this.getRestaurantId();
        this.setupSocketListeners();
        this.getWaiterCalls();
    }

    ngOnDestroy(): void {
        // Clean up socket listeners
        if (this.socket) {
            this.socket.off("new_waiter_call");
            this.socket.off("waiter_call_status_updated");
        }
    }

    initializeTable(): void {
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Customer Name", prop: "customerName" },
            { name: "Table", prop: "tableName" },
            { name: "Message", prop: "message" },
            { name: "Time", prop: "createdAt" },
            { name: "Status", prop: "status" },
        ];
    }

    getRestaurantId(): void {
        this.restaurantService.getRestaurnatDetail().subscribe({
            next: (res: any) => {
                if (res && res.data && res.data.restaurantDetail) {
                    this.restaurantId = res.data.restaurantDetail._id;

                    // Join restaurant room for real-time updates
                    this.socket.emit("joinRestaurantRoom", this.restaurantId);
                }
            },
        });
    }

    setupSocketListeners(): void {
        // Listen for new waiter calls
        this.socket.on("new_waiter_call", (data: any) => {
            console.log("New waiter call received:", data);
            // Add the new call to the top of the list
            this.rows = [data, ...this.rows];
        });

        // Listen for status updates
        this.socket.on("waiter_call_status_updated", (data: any) => {
            console.log("Waiter call status updated:", data);
            // Update the status of the call in the list
            this.rows = this.rows.map((row) => {
                if (row.callId === data.callId) {
                    return { ...row, status: data.status };
                }
                return row;
            });
        });
    }

    isRefreshing = false;

    getWaiterCalls(): void {
        console.log("Fetching waiter calls in waiter-calls component...");
        this.isRefreshing = true;

        this.restaurantService.getWaiterCalls().subscribe({
            next: (res: any) => {
                console.log("Waiter calls response:", res);
                if (res && res.data && res.data.waiterCalls) {
                    // Filter out resolved calls that are older than 5 minutes
                    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

                    this.rows = res.data.waiterCalls
                        .filter((call: any) => {
                            // Keep all non-resolved calls
                            if (call.status !== "resolved") return true;
                            // For resolved calls, only keep recent ones
                            const callDate = new Date(call.createdAt);
                            return callDate > fiveMinutesAgo;
                        })
                        .map((call: any) => ({
                            callId: call._id,
                            customerName: call.customerName,
                            tableName: call.tableName,
                            message: call.message || "No message",
                            createdAt: new Date(
                                call.createdAt
                            ).toLocaleString(),
                            status: call.status,
                            rawDate: new Date(call.createdAt),
                        }));

                    // Sort by date (newest first)
                    this.rows.sort((a: any, b: any) => b.rawDate - a.rawDate);
                    console.log("Processed waiter calls:", this.rows);
                } else {
                    console.log(
                        "No waiter calls found or invalid response format"
                    );
                    this.rows = [];
                }
                this.isRefreshing = false;
            },
            error: (err) => {
                console.error("Error fetching waiter calls:", err);
                this.rows = [];
                this.isRefreshing = false;
            },
        });
    }

    updateCallStatus(call: any, newStatus: string): void {
        const data = {
            callId: call.callId,
            status: newStatus,
            restaurantId: this.restaurantId, // Add restaurant ID to the request
        };

        console.log(
            `Updating waiter call ${call.callId} to status: ${newStatus}`
        );

        this.restaurantService.updateWaiterCallStatus(data).subscribe({
            next: (res: any) => {
                console.log(
                    `Waiter call status updated successfully to ${newStatus}:`,
                    res
                );

                // Update the local data immediately
                this.rows = this.rows.map((row) => {
                    if (row.callId === call.callId) {
                        return { ...row, status: newStatus };
                    }
                    return row;
                });

                // Also refresh from server after a short delay to ensure data consistency
                setTimeout(() => this.getWaiterCalls(), 500);
            },
            error: (err) => {
                console.error("Error updating waiter call status:", err);
                // Refresh anyway to ensure UI is in sync with server
                setTimeout(() => this.getWaiterCalls(), 500);
            },
        });
    }

    acknowledgeCall(call: any): void {
        this.updateCallStatus(call, "acknowledged");
    }

    resolveCall(call: any): void {
        this.updateCallStatus(call, "resolved");
    }

    applyFilter(): void {
        const val = this.searchTerm.toLowerCase();

        // Filter the original data
        const temp = this.rows.filter(function (d) {
            return (
                d.customerName.toLowerCase().indexOf(val) !== -1 ||
                d.tableName.toLowerCase().indexOf(val) !== -1 ||
                d.message.toLowerCase().indexOf(val) !== -1 ||
                d.status.toLowerCase().indexOf(val) !== -1 ||
                !val
            );
        });

        // Update the rows
        this.filteredData = temp;
    }

    getStatusClass(status: string): string {
        switch (status) {
            case "pending":
                return "badge-warning";
            case "acknowledged":
                return "badge-info";
            case "resolved":
                return "badge-success";
            default:
                return "badge-secondary";
        }
    }
}
