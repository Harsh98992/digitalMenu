import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "app-restaurant-contact-popup",
    templateUrl: "./restaurant-contact-popup.component.html",
    styleUrls: ["./restaurant-contact-popup.component.scss"],
})
export class RestaurantContactPopupComponent implements OnInit {
    contactDetails = [];
    constructor(@Inject(MAT_DIALOG_DATA) public restaurantData: any) {}

    ngOnInit(): void {
        this.initalizeContactDetail();
    }
    initalizeContactDetail() {
        console.log("the restaurant data in contact popup is", this.restaurantData);
        
        if (this.restaurantData && this.restaurantData.contact) {
            this.contactDetails = this.restaurantData.contact;
            console.log(this.contactDetails);

        }
    }
}
