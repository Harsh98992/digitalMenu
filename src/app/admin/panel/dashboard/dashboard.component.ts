import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrderService } from "src/app/api/order.service";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { OrderAcceptDialogComponent } from "../../../angular-material/order-accept-dialog/order-accept-dialog.component";
import { MatDialog } from "@angular/material/dialog";

import { environment } from "src/environments/environment";
const _ = require("lodash");
// Import the socket.io-client library
import { io } from "socket.io-client"; // Import the socket.io-client library
import { finalize, interval, Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import { UtilService } from "src/app/api/util.service";
import { CancelDialogComponent } from "../../layout/order-dialog/cancel-dialog/cancel-dialog.component";
import { AcceptDialogComponent } from "../../layout/order-dialog/accept-dialog/accept-dialog.component";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { PaymentDetailDialogComponent } from "src/app/angular-material/payment-detail-dialog/payment-detail-dialog.component";
import { PrintSpecificKotDialogComponent } from "src/app/angular-material/print-specific-kot-dialog/print-specific-kot-dialog.component";
import { PrintService, UsbDriver, WebPrintDriver } from "ng-thermal-print";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {
    status: boolean = false;
    usbPrintDriver: UsbDriver;
    webPrintDriver: WebPrintDriver;
    ip: string = "";
    pendingOrder = [];
    processingOrder = [];
    activeDine = [];
    pendingPayment = [];
    waiterCalls = [];
    private socket: any;
    apiUrl = environment.apiUrl;
    socketUrl = environment.socketApiUrl;
    restaurantId: any;
    private waiterCallsInterval: Subscription;
    private ordersInterval: Subscription;
    private socketReconnectInterval: Subscription;

    allOrders = [];
    activeTab = "tab1";
    apiCalledFlag: boolean;
    takeAwayOptions = ["take away", "grab and go", "schedule dining"];
    bypassOptions = ["room service", "grab and go", "dining"];

    constructor(
        private restaurantService: RestaurantPanelService,
        private orderService: OrderService,
        private modalService: NgbModal,
        public dialog: MatDialog,
        private datePipe: DatePipe,

        private utilityService: UtilService,
        private printService: PrintService
    ) {
        const device = JSON.parse(localStorage.getItem("printer-device"));
        if (device) {
            this.usbPrintDriver = new UsbDriver(
                device.vendorId,
                device.productId
            );
        } else {
            this.usbPrintDriver = new UsbDriver();
        }
        this.printService.setDriver(this.usbPrintDriver, "ESC/POS");
        this.printService.isConnected.subscribe((result) => {
            this.status = result;
            if (result) {
                console.log("Connected to printer!!!");
            } else {
                console.log("Not connected to printer.");
            }
        });
    }
    handleOrderUpdate(updatedOrder: any) {
        const index = this.allOrders.findIndex(
            (order) => order._id === updatedOrder._id
        );

        console.log("index", index);

        console.log("updatedOrder", updatedOrder);

        if (index !== -1) {
            this.allOrders[index] = updatedOrder;
        } else {
            this.allOrders.push(updatedOrder);
        }

        this.setOrder(this.allOrders);
    }

    restaurantDetail: any;

    totalBillForDineIn(details) {
        let total = 0;
        for (const order of details.orderDetails) {
            total +=
                order.orderAmount +
                order.gstAmount +
                order.deliveryAmount -
                order.discountAmount;
        }
        return total;
    }
    ngOnInit(): void {
        // Initial orders fetch
        this.getOrders();

        // Set up interval to refresh orders every 10 seconds
        // this.ordersInterval = interval(30000).subscribe(() => {
        //     console.log("Auto-refreshing orders (30-second interval)...");
        //     this.getOrders();
        // });

        this.restaurantService.getRestaurnatDetail().subscribe({
            next: (res: any) => {
                if (res && res.data && res.data.restaurantDetail) {
                    this.restaurantId = res.data.restaurantDetail._id;
                    this.restaurantDetail = res.data.restaurantDetail;
                    console.log("Restaurant ID:", this.restaurantId);
                }

                this.getWaiterCalls();
            },
            error: (err) => {
                console.error("Error getting restaurant details:", err);
            },
        });

        // Initialize Socket.io with proper transport options and reconnection settings
        this.socket = io(this.socketUrl, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            timeout: 20000,
        });
        console.log("Socket initialized with transport options:", this.socket);

        this.socket.on("connect", () => {
            console.log("Socket connected successfully");

            this.restaurantService.getRestaurnatDetail().subscribe({
                next: (res: any) => {
                    if (res && res.data && res.data.restaurantDetail) {
                        this.restaurantId = res.data.restaurantDetail._id;
                        this.restaurantDetail = res.data.restaurantDetail;
                        console.log("Restaurant ID:", this.restaurantId);

                        // Join the restaurant's room
                        this.socket.emit(
                            "joinRestaurantRoom",
                            this.restaurantId
                        );
                        console.log(
                            "Attempting to join restaurant room:",
                            this.restaurantId
                        );

                        // Listen for confirmation that we've joined the room
                        this.socket.on("joined_restaurant_room", (data) => {
                            console.log(
                                "Successfully joined restaurant room:",
                                data
                            );
                        });

                        // Get initial waiter calls
                        this.getWaiterCalls();
                    } else {
                        console.error("Failed to get restaurant details");
                    }
                },
                error: (err) => {
                    console.error("Error getting restaurant details:", err);
                },
            });
        });

        // Listen for order updates
        this.socket.on("orderUpdate", (updatedOrder: any) => {
            console.log("Order update received:", updatedOrder);
            this.getOrders();
        });

        // Listen for new waiter calls
        this.socket.on("new_waiter_call", (data: any) => {
            console.log("New waiter call received:", data);
            // Add the new call to the top of the list if it doesn't already exist
            const exists = this.waiterCalls.some(
                (call) => call.callId === data.callId
            );
            if (!exists) {
                this.waiterCalls = [data, ...this.waiterCalls];
                // Play notification sound
                this.restaurantService.playDashboardActionSound();
                // Update the tab to show the new count
                this.selectTab("tab5");
            }
        });

        // Listen for waiter call status updates
        this.socket.on("waiter_call_status_updated", (data: any) => {
            console.log("Waiter call status updated:", data);
            // Update the status of the call in the list
            let found = false;
            this.waiterCalls = this.waiterCalls.map((call) => {
                if (call.callId === data.callId) {
                    found = true;
                    return { ...call, status: data.status };
                }
                return call;
            });

            // If the call wasn't found in our list, refresh the list from the server
            if (!found) {
                console.log("Call not found in list, refreshing from server");
                this.getWaiterCalls();
            }

            // If status is resolved, remove from the list after a delay
            if (data.status === "resolved") {
                setTimeout(() => {
                    this.waiterCalls = this.waiterCalls.filter(
                        (call) => call.callId !== data.callId
                    );
                }, 5000);
            }
        });

        // Enhanced error handling for socket connection
        this.socket.on("connect_error", (error: any) => {
            console.error("Socket connection error:", error);
            // Attempt to reconnect with different transport if needed
            if (this.socket.io.opts.transports.indexOf("polling") === 0) {
                console.log("Switching to WebSocket transport...");
                this.socket.io.opts.transports = ["websocket"];
            } else if (
                this.socket.io.opts.transports.indexOf("websocket") === 0
            ) {
                console.log("Switching back to polling transport...");
                this.socket.io.opts.transports = ["polling", "websocket"];
            }
        });

        this.socket.on("disconnect", (reason: string) => {
            console.log("Socket disconnected:", reason);
            // If the server disconnected us, try to reconnect manually
            if (reason === "io server disconnect") {
                console.log(
                    "Server disconnected the socket, attempting to reconnect..."
                );
                this.socket.connect();
            }
        });

        // Listen for pong response from server
        this.socket.on("pong_socket", (data) => {
            console.log("Received pong from server:", data);
        });

        // Set up interval to refresh waiter calls every 30 seconds
        // this.waiterCallsInterval = interval(30000).subscribe(() => {
        //     console.log("Auto-refreshing waiter calls (30-second interval)...");
        //     this.getWaiterCalls();
        // });

        // Set up a socket reconnection check every 60 seconds
        this.socketReconnectInterval = interval(60000).subscribe(() => {
            if (!this.socket.connected) {
                console.log("Socket disconnected, attempting to reconnect...");
                // Try to reconnect with both transport options
                this.socket.io.opts.transports = ["websocket", "polling"];
                this.socket.connect();

                // Send a ping after reconnection attempt
                setTimeout(() => {
                    if (this.socket.connected) {
                        console.log("Socket reconnected, sending ping...");
                        this.socket.emit("ping_socket", {
                            message: "Ping after reconnection",
                            timestamp: new Date(),
                        });
                    }
                }, 2000);
            }
        });
    }
    selectTab(tab: string) {
        this.activeTab = tab;
    }
    toggleLoyalStatus(row) {
        const customerId = row.customerId; // Replace with the actual property holding customer ID

        const isLoyal = !row?.loyalFlag;

        // Call the API to toggle loyal status
        this.restaurantService
            .toggleLoyalOrBlockStatus("loyal", customerId, isLoyal)
            .subscribe({
                next: (res: any) => {
                    this.ngOnInit();
                },
            });
    }
    openDialog(orderDetail: any) {
        this.dialog
            .open(OrderAcceptDialogComponent, {
                minWidth: "90vw",
                data: orderDetail,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    console.log("called api");

                    this.getOrders();
                }
            });
    }
    getChoicesList(choicesData) {
        let str = "";
        for (const data of choicesData) {
            for (const choice of data.choicesSelected) {
                str += `${choice.choiceName} ,`;
            }
        }
        return str.slice(0, -1);
    }
    getExtrasList(extraData) {
        let str = "";
        for (const data of extraData) {
            for (const addon of data.addOnsSelected) {
                str += `${addon.addOnName} ,`;
            }
        }
        return str.slice(0, -1);
    }
    openKOTPrintDialg(detail) {
        this.dialog
            .open(PrintSpecificKotDialogComponent, {
                panelClass: "add-item-dialog",
                disableClose: true,
                data: detail,
            })
            .afterClosed()
            .subscribe((resp) => {
                if (resp) {
                    console.log(resp);
                    this.printKTO(resp);
                }
            });
    }
    openCancelOrderDialog(orderDetail) {
        let dialogRef = this.dialog
            .open(CancelDialogComponent, {
                disableClose: true,
                panelClass: "app-full-bleed-dialog",
                data: orderDetail,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    this.restaurantService.playDashboardActionSound();
                    this.getOrders();
                }
            });
    }
    openAcceptDialog(orderDetail) {
        let dialogRef = this.dialog
            .open(AcceptDialogComponent, {
                disableClose: true,
                panelClass: "add-item-dialog",
                data: orderDetail,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && res.successFlag) {
                    this.restaurantService.playDashboardActionSound();
                    this.getOrders();
                    if (res?.printKOT) {
                        this.printKTO(orderDetail);
                    }
                }
            });
    }
    openPaymentDetailDialog(orderDetail) {
        let dialogRef = this.dialog.open(PaymentDetailDialogComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
            data: orderDetail,
        });
    }
    completeOrder(orderDetail) {
        const dialogData = {
            title: "Confirm",
            message:
                "Please confirm if you wish to proceed and complete this order.",
            printBill: true,
        };
        this.dialog
            .open(ConfirmDialogComponent, { data: dialogData })
            .afterClosed()
            .subscribe({
                next: (res: any) => {
                    console.log(res);

                    if (res && res.okFlag) {
                        this.orderService
                            .changeOrderStatus({
                                orderStatus: "completed",
                                orderId: orderDetail._id,
                            })
                            .subscribe({
                                next: () => {
                                    this.restaurantService.playDashboardActionSound();
                                    this.getOrders();
                                    if (res?.printBill) {
                                        this.printReceipt(orderDetail);
                                    }
                                },
                            });
                    }
                },
            });
    }
    getOrders() {
        const reqData = {
            orderStatus: ["pending", "processing", "pendingPayment"],
        };
        this.orderService
            .getRestaurantOrdersByStatus(reqData)
            .pipe(
                finalize(() => {
                    this.apiCalledFlag = true;
                })
            )
            .subscribe({
                next: (res: any) => {
                    if (res && res?.data && res.data && res.data?.orderData) {
                        this.setOrder(res.data.orderData);

                        this.allOrders = res.data.orderData;
                    }
                },
            });
    }
    setOrder(orderData: any) {
        this.pendingOrder = [];
        this.processingOrder = [];
        this.activeDine = [];
        this.pendingPayment = [];
        for (const data of orderData) {
            if (data.orderStatus === "pending") {
                this.pendingOrder.push(data);
                console.log("pendingOrder", this.pendingOrder);
            } else if (
                data.orderStatus === "processing" &&
                data.customerPreferences.preference !== "Dine In"
            ) {
                this.processingOrder.push(data);
                console.log("processingOrder", this.processingOrder);
            } else if (
                data.orderStatus === "processing" &&
                data.customerPreferences.preference === "Dine In"
            ) {
                this.activeDine.push(data);
                console.log(this.activeDine);
            } else if (data.orderStatus === "pendingPayment") {
                this.pendingPayment.push(data);
            }
        }
        this.checkForSoundPause();
    }
    checkForSoundPause() {
        if (this.pendingOrder && this.pendingOrder.length) {
            // this.restaurantService.playSound(true);
        } else {
            this.restaurantService.playSound(false);
        }
    }

    // Get waiter calls from the backend
    isRefreshing = false;

    getWaiterCalls() {
        console.log("Fetching waiter calls...");
        this.isRefreshing = true;
        this.restaurantService.getWaiterCalls().subscribe({
            next: (res: any) => {
                console.log("Waiter calls response:", res);
                if (res && res.data && res.data.waiterCalls) {
                    // Filter out resolved calls that are older than 5 minutes
                    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

                    const calls = res.data.waiterCalls
                        .filter((call) => {
                            // Keep all non-resolved calls
                            if (call.status !== "resolved") return true;
                            // For resolved calls, only keep recent ones
                            const callDate = new Date(call.createdAt);
                            return callDate > fiveMinutesAgo;
                        })
                        .map((call) => ({
                            callId: call._id,
                            restaurantId: call.restaurantId,
                            tableId: call.tableId,
                            tableName: call.tableName,
                            customerName: call.customerName,
                            message: call.message || "No message",
                            createdAt: new Date(
                                call.createdAt
                            ).toLocaleString(),
                            status: call.status,
                            rawDate: new Date(call.createdAt),
                        }));

                    // Sort by date (newest first)
                    calls.sort((a, b) => b.rawDate - a.rawDate);

                    // Update the waiter calls array
                    this.waiterCalls = calls;
                    console.log("Processed waiter calls:", this.waiterCalls);

                    // Send a ping to the socket server to check connection
                    this.socket.emit("ping_socket", {
                        message: "Ping from dashboard",
                        timestamp: new Date(),
                    });
                } else {
                    console.log(
                        "No waiter calls found or invalid response format"
                    );
                    this.waiterCalls = [];
                }
                this.apiCalledFlag = true;
                this.isRefreshing = false;
            },
            error: (err) => {
                console.error("Error fetching waiter calls:", err);
                this.waiterCalls = [];
                this.apiCalledFlag = true;
                this.isRefreshing = false;
            },
        });
    }

    // Acknowledge a waiter call
    acknowledgeWaiterCall(call: any) {
        const data = {
            callId: call.callId,
            status: "acknowledged",
            restaurantId: this.restaurantId, // Add restaurant ID to the request
        };
        console.log("Sending acknowledge request with data:", data);
        this.restaurantService.updateWaiterCallStatus(data).subscribe({
            next: (res: any) => {
                console.log("Waiter call acknowledged successfully:", res);
                // Update the call status in the local array
                this.waiterCalls = this.waiterCalls.map((c) => {
                    if (c.callId === call.callId) {
                        return { ...c, status: "acknowledged" };
                    }
                    return c;
                });
                // Also refresh from server to ensure data consistency
                setTimeout(() => this.getWaiterCalls(), 500);
            },
            error: (err) => {
                console.error("Error acknowledging waiter call:", err);
                // Refresh anyway to ensure UI is in sync with server
                setTimeout(() => this.getWaiterCalls(), 500);
            },
        });
    }

    // Resolve a waiter call
    resolveWaiterCall(call: any) {
        const data = {
            callId: call.callId,
            status: "resolved",
            restaurantId: this.restaurantId, // Add restaurant ID to the request
        };

        console.log("Sending resolve request with data:", data);
        this.restaurantService.updateWaiterCallStatus(data).subscribe({
            next: (res: any) => {
                console.log("Waiter call resolved successfully:", res);
                // Update the call status in the local array
                this.waiterCalls = this.waiterCalls.map((c) => {
                    if (c.callId === call.callId) {
                        return { ...c, status: "resolved" };
                    }
                    return c;
                });
                // Also refresh from server to ensure data consistency
                setTimeout(() => this.getWaiterCalls(), 500);
            },
            error: (err) => {
                console.error("Error resolving waiter call:", err);
                // Refresh anyway to ensure UI is in sync with server
                setTimeout(() => this.getWaiterCalls(), 500);
            },
        });
    }

    // Get CSS class for waiter call status badge
    getWaiterCallStatusClass(status: string): string {
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

    ngOnDestroy() {
        // Disconnect the socket when component is destroyed
        if (this.socket) {
            console.log("Disconnecting socket in ngOnDestroy");
            this.socket.disconnect();
        }

        // Clean up the interval subscriptions to prevent memory leaks
        if (this.waiterCallsInterval) {
            this.waiterCallsInterval.unsubscribe();
        }

        // Clean up the orders refresh interval
        if (this.ordersInterval) {
            this.ordersInterval.unsubscribe();
        }

        // Clean up the socket reconnection interval
        if (this.socketReconnectInterval) {
            this.socketReconnectInterval.unsubscribe();
        }
    }

    getTotalDineIn(orderData) {
        let amount = 0;
        for (const order of orderData.orderDetails) {
            amount += order.orderAmount;
            amount += order.gstAmount;
            amount -= order.discountAmount;
        }
        return amount;
    }
    printKTO(orderData) {
        if (!this.status) {
            this.usbPrintDriver.requestUsb().subscribe(
                (result) => {
                    this.printService.setDriver(this.usbPrintDriver, "ESC/POS");
                    setTimeout(() => {
                        if (this.status) {
                            this.printEPOSRecieptHelper(
                                orderData,
                                this.restaurantDetail,
                                true
                            );
                        } else {
                            this.utilityService.printKTOHelper(
                                orderData,
                                this.restaurantDetail
                            );
                        }
                    }, 2000);
                },
                (err) => {
                    this.utilityService.printKTOHelper(
                        orderData,
                        this.restaurantDetail
                    );
                }
            );
        } else {
            this.printEPOSRecieptHelper(orderData, this.restaurantDetail, true);
        }
        // this.printKTOHelper(orderData);
        // const reqData = {
        //     orderDetail: orderData,
        //     restaurantDetail: this.restaurantDetail,
        //     kotFlag: true,
        // };
        // this.restaurantService.generateBill(reqData).subscribe({
        //     next: (res: any) => {
        //         if (res && res?.data?.state?.toLowerCase() == "fail") {
        //             this.printKTOHelper(orderData);
        //         }
        //     },
        // });
    }

    printEPOSRecieptHelper(orderDetail, restaurantDetail, flag = false) {
        this.utilityService.printEPOSReciept(
            orderDetail,
            restaurantDetail,
            flag
        );
    }
    printReceipt(orderDetail: any) {
        if (!this.status) {
            this.usbPrintDriver.requestUsb().subscribe(
                (result) => {
                    this.printService.setDriver(this.usbPrintDriver, "ESC/POS");

                    setTimeout(() => {
                        if (this.status) {
                            this.utilityService.setPrinterDriver(result);
                            this.printEPOSRecieptHelper(
                                orderDetail,
                                this.restaurantDetail
                            );
                        } else {
                            this.utilityService.printReceipt(
                                orderDetail,
                                this.restaurantDetail
                            );
                        }
                    }, 1000);
                },
                (err) => {
                    this.utilityService.printReceipt(
                        orderDetail,
                        this.restaurantDetail
                    );
                }
            );
        } else {
            this.printEPOSRecieptHelper(orderDetail, this.restaurantDetail);
        }

        // this.utilityService.printReceipt(
        //     orderDetail,
        //     this.restaurantDetail
        // );
        // const reqData = {
        //     orderDetail,
        //     restaurantDetail: this.restaurantDetail,
        //     kotFlag: false,
        // };
        // this.restaurantService.generateBill(reqData).subscribe({
        //     next: (res: any) => {
        //         if (res && res?.data?.state?.toLowerCase() == "fail") {

        //         }
        //     },
        // });
    }
}
