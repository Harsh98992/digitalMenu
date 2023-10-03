import { Component, OnInit } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-restaurant-qr-code",
    templateUrl: "./restaurant-qr-code.component.html",
    styleUrls: ["./restaurant-qr-code.component.scss"],
})
export class RestaurantQrCodeComponent implements OnInit {
    public myAngularxQrCode: string = "";
    public qrCodeDownloadLink: SafeUrl = "";
    constructor(private restaurantService: RestaurantPanelService) {}

    ngOnInit(): void {
        this.getRestaurantDetail();
    }
    getRestaurantDetail() {
        this.restaurantService.restaurantData.subscribe({
            next: (res: any) => {
                if (res && res.restaurantUrl) {
                    this.myAngularxQrCode = `${window.location.origin}/restaurant?detail=${res.restaurantUrl}`;
                }
            },
        });
    }
    onChangeURL(url: SafeUrl) {
        this.qrCodeDownloadLink = url;
    }
}
