import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentDialogComponent } from "src/app/angular-material/payment-dialog/payment-dialog.component";
import { RestaurantService } from "../../api/restaurant.service";
import { RestaurantContactPopupComponent } from "../restaurant-menu/restaurant-contact-popup/restaurant-contact-popup.component";

@Component({
    selector: "app-order-tracking",
    templateUrl: "./order-tracking.component.html",
    styleUrls: ["./order-tracking.component.scss"],
})
export class OrderTrackingComponent implements OnInit {
    seconds: number = 60; // Initial countdown value
    interval: any;
    orderId = "";
    restaurantId: any;
    restaurantData: any;
    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private restauraantService: RestaurantService,
        private router: Router
    ) {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    ngOnInit(): void {
        this.getOrderId();
    }
    getOrderId() {
        this.route.params.subscribe((params) => {
            this.orderId = params["orderId"]; // 'id' should match the parameter defined in the route
            this.restaurantId = params["restaurantId"];
        });
        this.getRestaurantDetails();
    }
    getRestaurantDetails() {
        this.restauraantService.getRestaurantById(this.restaurantId).subscribe({
            next: (res: any) => {
                if (res?.data?.restaurant) {
                    this.restaurantData = res.data.restaurant;
                }
            },
        });
    }
    openContactDialog() {
        this.dialog.open(RestaurantContactPopupComponent, {
            panelClass: "add-item-dialog",
            disableClose: true,
            data: this.restaurantData,
        });
    }
    copyText() {
        var copyText = document.createElement("textarea");
        copyText.value = this.orderId;
        document.body.appendChild(copyText);
        copyText.select();
        document.execCommand("copy");
        document.body.removeChild(copyText);
        alert("order id has been copied!");
    }
    redirectTotrackingPage() {
        // Redirect to a specific URL using navigateByUrl
        this.router.navigateByUrl("/tracking");
    }

    openDialg() {
        // this.dialog.open(PaymentDialogComponent, {
        //     panelClass: "add-item-dialog",
        //     data: {},
        //     disableClose: true,
        // });
    }
}
