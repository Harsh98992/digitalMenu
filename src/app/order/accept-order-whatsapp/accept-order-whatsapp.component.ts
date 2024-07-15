import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "src/app/api/util.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

@Component({
    selector: "app-accept-order-whatsapp",
    templateUrl: "./accept-order-whatsapp.component.html",
    styleUrls: ["./accept-order-whatsapp.component.scss"],
})
export class AcceptOrderWhatsappComponent implements OnInit {
    printWindow: any;
    constructor(
        private route: ActivatedRoute,
        private restaurantService: RestaurantService,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.getOrderId();
    }
    getOrderId() {
        this.route.params.subscribe((params: any) => {
            this.getOrderDataFromServer(params.orderId);
        });
    }
    getOrderDataFromServer(orderId: any) {
        if (orderId) {
            this.restaurantService.getOrderwithOrderId(orderId).subscribe({
                next: (res) => {
                    if (res && res["data"]?.["orderData"]?._id) {
                        const orderData = res["data"]["orderData"];
                        this.restaurantService
                            .getRestaurantById(
                                res["data"]?.["orderData"]?.restaurantId
                            )
                            .subscribe({
                                next: (res) => {
                                    const restaurantData =
                                        res["data"]["restaurant"];
                                    const output =
                                        this.utilService.printReceipt(
                                            orderData,
                                            restaurantData,
                                            true
                                        ) as any;
                                        this.printWindow = output.split("<body>")[1];
                                        console.log(this.printWindow);
                                },
                            });
                        // const orderSummary = res["data"]["orderData"];
                        // this.utilService.printReceipt(orderSummary);
                    } else {
                    }
                },
            });
        }
    }
}
