import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AddAddressMapComponent } from "../add-address-map/add-address-map.component";
import { CustomerService } from "src/app/api/customer.service";
import { HttpClient } from "@angular/common/http";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";

// Add this import for geolocation calculations
// import { getDistance } from "geolib"; // Make sure you have the 'geolib' library installed

@Component({
    selector: "app-address-selection",
    templateUrl: "./address-selection.component.html",
    styleUrls: ["./address-selection.component.scss"],
})

export class AddressSelectionComponent implements OnInit {
    addresses: any[]; // Array of addresses to be fetched or provided
    selectedAddress: string;
    restaurantDetails: any; // Restaurant details fetched from the API
    restaurantAddress: any; // Address of the restaurant
    restaurantAddressLatitude: number; // Latitude of the restaurant
    restaurantAddressLongitude: number; // Longitude of the restaurant
    maxDeliveryDistance: number; // Maximum delivery distance of the restaurant

    getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    }

    calculateDistances(): void {
        if (this.restaurantAddressLatitude && this.restaurantAddressLongitude) {
            for (const address of this.addresses) {
                const distance = this.getDistance(
                    this.restaurantAddressLatitude,
                    this.restaurantAddressLongitude,
                    address.latitude,
                    address.longitude
                );

                console.log(
                    "Distance: from " + address.address + " is " + distance
                );

                console.log(
                    "Max delivery distance: " + this.maxDeliveryDistance
                );

                console.log(
                    "Is address disabled: " +
                        (distance > this.maxDeliveryDistance)
                );

                console.log("Address: ", address);

                address.distance = distance; // Add the calculated distance to the address object
                address.disabled = distance > this.maxDeliveryDistance; // Disable the address if the distance is greater than the maximum delivery distance
            }
        }
    }

    constructor(
        private dialog: MatDialog,
        private customerService: CustomerService,
        private httpClient: HttpClient,
        @Inject(MAT_DIALOG_DATA) public restaurantData: any,

        public dialogRef: MatDialogRef<AddressSelectionComponent>
    ) {}

    ngOnInit(): void {
        this.getRestaurantDetailsFromRestaurantUrl();
    }
    openAddAddressMapDialog() {
        const dialogRef = this.dialog.open(AddAddressMapComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
            data: {
                showCompleteAddressButton: true,
                editMode: false,
                fromOrdersPage: true,
                restaurantAddressLatitude: this.restaurantAddressLatitude,
                restaurantAddressLongitude: this.restaurantAddressLongitude,
                maxDeliveryDistance: this.maxDeliveryDistance,
            },
        });

        dialogRef.afterClosed().subscribe((completeAddress) => {
            if (completeAddress) {
                // Handle the complete address (Add logic to save the complete address)
                console.log("Complete Address: ", completeAddress);
                const data = {
                    address: completeAddress.completeAddress,
                    latitude: completeAddress.latitude,
                    longitude: completeAddress.longitude,
                    pinCode: completeAddress.pinCode,
                    googleLocationAddress:
                        completeAddress.googleLocationAddress,
                };
                // Send the complete address to the API to save
                this.customerService.addCustomerAddress(data).subscribe(
                    (response) => {
                        // Successfully saved the address
                        console.log("Address saved:", response);



                        this.getRestaurantDetailsFromRestaurantUrl();


                        // auto select the address after adding
                        this.selectedAddress = response["data"]["address"]["_id"];

                        this.selectAddress();
                    },
                    (error) => {
                        // Handle error if saving address fails
                        console.error("Error saving address:", error);
                    }
                );
            }
        });
    }

    editAddress(address: any) {
        // Open the AddAddressMapComponent with the selected address for editing
        const dialogRef = this.dialog.open(AddAddressMapComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
            data: {
                showCompleteAddressButton: true, // Do not show the "Add Complete Address" button in edit mode
                editAddressData: address, // Pass the selected address data to the dialog
                editMode: true, // Set the edit mode flag to true
            },
        });

        dialogRef.afterClosed().subscribe((editedAddress) => {
            if (editedAddress) {
                // Handle the edited address (Add logic to save the edited address)
                console.log("Edited Address: ", editedAddress);
                const data = {
                    address: editedAddress.completeAddress,
                    latitude: editedAddress.latitude,
                    longitude: editedAddress.longitude,
                    pinCode: editedAddress.pinCode,
                    addressId: address._id,
                };
                // Send the edited address to the API to update
                this.customerService.editCustomerAddress(data).subscribe(
                    (response) => {
                        // Successfully updated the address
                        console.log("Address updated:", response);

                        //

                        this.getRestaurantDetailsFromRestaurantUrl();
                    },
                    (error) => {
                        // Handle error if updating address fails
                        console.error("Error updating address:", error);
                    }
                );
            }
        });
    }

    selectAddress() {
        console.log(this.selectedAddress);

        if (this.selectedAddress) {
            this.dialogRef.close({
                selectedAddress: this.selectedAddress,
            });
        }
    }
    getCustomerAddresses() {
        this.customerService.getCustomer().subscribe(
            (data) => {
                console.log("Data: ", data);
                this.addresses = data["data"]["customer"]["addresses"];

                console.log("Address: ", this.addresses);

                console.log("Address: ", this.addresses);

                this.calculateDistances();
            },
            (error) => {
                console.error("Error fetching addresses:", error);
            }
        );
    }

    onSelectAddress() {
        if (this.selectedAddress) {
            console.log("Selected Address: ", this.selectedAddress);
        }
    }

    getRestaurantDetailsFromRestaurantUrl() {
        // restaurant url is the current url opened in the browser
        let restaurantUrl = window.location.href;

        // // take out yoursPizza from the url http://localhost:4200/restaurant?detail=yoursPizza details=
        restaurantUrl = restaurantUrl.split("?detail=")[1];


        // let restaurantUrl = this.restaurantData["restaurantUrl"];

        // Get the restaurant address from the API
        this.customerService
            .getRestaurantDetailsFromRestaurantUrl(restaurantUrl)
            .subscribe((data) => {
                console.log("Data from API of restaurant address: ", data);

                this.restaurantDetails = data["data"]["restaurant"];
                this.restaurantAddress = this.restaurantDetails.address;
                this.restaurantAddressLatitude =
                    this.restaurantAddress.latitude;

                this.restaurantAddressLongitude =
                    this.restaurantAddress.longitude;

                this.maxDeliveryDistance =
                    this.restaurantDetails.maxDeliveryDistance;

                console.log("Restaurant Address: ", this.restaurantAddress);

                console.log(
                    "Restaurant Address Latitude: ",
                    this.restaurantAddressLatitude
                );

                console.log(
                    "Restaurant Address Longitude: ",

                    this.restaurantAddressLongitude
                );
                this.getCustomerAddresses();
            });
    }

    deleteAddress(addressId: string) {
        const dialogData = {
            title: "Confirm",
            message: "Are you sure you want to delete this item?",
        };
        this.dialog
            .open(ConfirmDialogComponent, { data: dialogData })
            .afterClosed()
            .subscribe({
                next: (res: any) => {
                    if (res && res.okFlag) {
                        this.customerService
                            .deleteAddressOfRequestCustomerById(addressId)
                            .subscribe((response) => {
                                // Successfully deleted the address
                                console.log("Address deleted:", response);

                                this.getRestaurantDetailsFromRestaurantUrl();
                            });
                    }
                },
            });
    }
}
