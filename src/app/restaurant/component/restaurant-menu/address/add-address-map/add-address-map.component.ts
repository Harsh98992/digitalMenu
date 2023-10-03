import { Component, OnInit, Inject, Input } from "@angular/core";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { AddCompleteAddressComponent } from "./add-complete-address/add-complete-address.component";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
} from "rxjs/operators";
import { of } from "rxjs";
import { environment } from "src/environments/environment";
// C:\AM\Github\DigitalMenu\src\app\api\googlemaps.service.ts
import { GoogleMapsService } from "src/app/api/googlemaps.service";
import { UtilService } from "src/app/api/util.service";
import { set } from "lodash";

@Component({
    selector: "app-add-address-map",
    templateUrl: "./add-address-map.component.html",
    styleUrls: ["./add-address-map.component.scss"],
})
export class AddAddressMapComponent implements OnInit {
    mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
    mapZoom = 15;
    apiLoaded: Observable<boolean>;
    markerPosition: google.maps.LatLngLiteral;
    pinCode: string = "";
    completeAddress: string = "";
    searchQuery: string = "";
    autocompleteResults: any[] = [];
    apiUrl: string = environment.apiUrl;

    showCompleteAddressButton: boolean = false;

    googleLocationAddress: string = "";

    // Create a subject to handle search query debouncing
    private searchQuerySubject = new Subject<string>();

    constructor(
        private dialog: MatDialog,
        private httpClient: HttpClient,
        public dialogRef: MatDialogRef<AddAddressMapComponent>,
        private googleMapsService: GoogleMapsService,
        private utilService: UtilService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.apiLoaded = httpClient
            .jsonp(
                "https://maps.googleapis.com/maps/api/js?key=AIzaSyA565Z7yEHcoZ1TMV4Asu3TZQGn0W2Np_A",
                "callback"
            )
            .pipe(
                map(() => true),
                catchError(() => of(false))
            );
    }

    ngOnInit(): void {
        // Set the         @Inject(MAT_DIALOG_DATA) public data: any

        this.showCompleteAddressButton = this.data.showCompleteAddressButton;

        if (this.data.editMode) {
            console.log("Edit mode");
            console.log("Data:", this.data);
            this.completeAddress = this.data.completeAddress;
            this.pinCode = this.data.pinCode;
            this.mapCenter = {
                lat: this.data.latitude,
                lng: this.data.longitude,
            };

            this.markerPosition = this.mapCenter;
        } else {
            // Load the user's location and set the map center
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("Geolocation position:", position);

                        if (
                            this.checkIfLocationIsWithinDeliveryRange(
                                position.coords.latitude,
                                position.coords.longitude
                            )
                        ) {
                            this.mapCenter = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            this.markerPosition = this.mapCenter; // Set the marker to the current location by default
                            // Get the pin code from the Geocoding API
                            this.setGeocodeDetails();
                        } else {
                            this.mapCenter = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            this.utilService.openSnackBar(
                                "Sorry, we don't deliver to your current location!. Please select a different location",
                                true
                            );
                        }
                    },
                    (error) => {
                        console.log("Geolocation error", error);
                    }
                );
            }
        }

        // Subscribe to the search query subject with debounceTime and distinctUntilChanged
        this.searchQuerySubject
            .pipe(
                debounceTime(1000), // Adjust the debounceTime value as needed
                distinctUntilChanged() // Only emit if the search query has changed since the last emission
            )
            .subscribe((query) => {
                this.onSearchInputChanged(query);
            });
    }

    onSearchInputChanged(query: string) {
        this.googleMapsService
            .getAutocompleteResults(query)
            .subscribe((results) => {
                this.autocompleteResults = results;
            });
    }
    // Push the search query to the subject for debouncing
    onSearchInput(query: string) {
        this.searchQuerySubject.next(query);
    }

    // Function to handle selecting a location from the autocomplete results
    onSelectLocation(location: any) {
        this.searchQuery = location.description;
        this.autocompleteResults = [];

        console.log("Selected location:", location);
        let placeId = location.place_id;
        this.googleMapsService.getPlaceDetails(placeId).subscribe((results) => {
            console.log("Place details:", results);
            this.mapCenter = {
                lat: results.geometry.location.lat,
                lng: results.geometry.location.lng,
            };
            if (
                this.checkIfLocationIsWithinDeliveryRange(
                    results.geometry.location.lat,
                    results.geometry.location.lng
                )
            ) {
                this.markerPosition = this.mapCenter;
                this.setGeocodeDetails();
            } else {
                this.utilService.openSnackBar(
                    "Sorry, we don't deliver to your selected location!. Please select a different location",
                    true
                );
            }
        });
    }

    onSelectLocationButton() {
        // return location lat, lng
        this.dialogRef.close(this.markerPosition);
    }
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

    onMapClick(event: google.maps.MapMouseEvent) {
        if (
            this.checkIfLocationIsWithinDeliveryRange(
                event.latLng.lat(),
                event.latLng.lng()
            )
        ) {
            // update the marker position
            this.markerPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };

            // update the map center
            this.mapCenter = this.markerPosition;
            this.setGeocodeDetails();
        } else {
            // show an error message
            this.utilService.openSnackBar(
                `You can't select a location that is more than ${this.data.maxDeliveryDistance} km away from the restaurant`,
                true,
                3000
            );
        }
    }
    @Input("restaurantData") restaurantData;

    checkIfLocationIsWithinDeliveryRange(latitude, longitude) {
        // get the distance between the restaurant and the customer
        const currentUrl = window.location.href;
        console.log(
            "latitude, longitude, this.data.restaurantAddressLatitude, this.data.restaurantAddressLongitude",
            latitude,

            longitude,

            this.data.restaurantAddressLatitude,
            this.data.restaurantAddressLongitude
        );
        if (
            currentUrl.includes("restaurant?detail=") &&
            this.showCompleteAddressButton &&
            this.data.restaurantAddressLatitude &&
            this.data.restaurantAddressLongitude
        ) {
            const distance = this.getDistance(
                latitude,
                longitude,
                this.data.restaurantAddressLatitude,
                this.data.restaurantAddressLongitude
            );

            console.log(
                "Distance for this marker from the restaurant:",
                distance
            );

            // check if the distance is less than this.data.maxDeliveryDistance
            if (distance <= this.data.maxDeliveryDistance) {
                // if the distance is less than this.data.maxDeliveryDistance
                return true;
            } else {
                // if the distance is greater than this.data.maxDeliveryDistance
                return false;
            }
        } else {
            return true;
        }
    }

    setGeocodeDetails() {
        this.googleMapsService
            .getGeocodeDetails(this.markerPosition.lat, this.markerPosition.lng)
            .subscribe((response) => {
                AddressComponent: response.results[0].address_components.forEach(
                    (addressComponent) => {
                        if (addressComponent.types[0] === "postal_code") {
                            this.pinCode = addressComponent.long_name;
                        }
                    }
                );

                this.googleLocationAddress =
                    response.results[0].formatted_address;

                console.log("Geocode details:", response);

                console.log("Pin code:", this.pinCode);

                console.log(
                    "Google location address:",
                    this.googleLocationAddress
                );

                this.utilService.openSnackBar(
                    "Your approximate location address is " +
                        this.googleLocationAddress +
                        " if you want to change it, Please click on the marker and drag it to your desired location",
                    false,
                    5000
                );
            });
    }

    openAddCompleteAddressDialog() {
        // check if the marker position is within the delivery range

        if (
            this.checkIfLocationIsWithinDeliveryRange(
                this.markerPosition.lat,
                this.markerPosition.lng
            )
        ) {
            this.dialog
                .open(AddCompleteAddressComponent, {
                    panelClass: "add-item-dialog",
                    data: {
                        latitude: this.markerPosition.lat,
                        longitude: this.markerPosition.lng,
                        pinCode: this.pinCode,
                        googleLocationAddress: this.googleLocationAddress,
                    },
                })
                .afterClosed()
                .subscribe((result) => {
                    if (result) {
                        // close the dialog and return to the parent component
                        console.log("Dialog result:", result);
                        this.dialogRef.close(result);
                    }
                });
        } else {
            // show an error message
            this.utilService.openSnackBar(
                "select a location within the delivery range to add a complete address"
            );
        }
    }

    onCancelClick() {
        // Handle cancel action here
    }
}
