import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/api/authentication.service";
import { UserLoginComponent } from "src/app/user-auth/user-login/user-login.component";
import { CustomerAuthService } from "../../api/customer-auth.service";
import { RestaurantService } from "../../api/restaurant.service";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { CustomerService } from "src/app/api/customer.service";
import { Observable, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { RestaurantContactPopupComponent } from "../restaurant-menu/restaurant-contact-popup/restaurant-contact-popup.component";
@Component({
    selector: "app-homepage",
    templateUrl: "./homepage.component.html",
    styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit {
    userLoginFlag = false;
    restaurantData = [];
    searchResults = [];
    searchQuery = "";
    autocompleteResults: any[] = []; // Initialize an array to store autocomplete results

    constructor(
        private dialog: MatDialog,
        private customerAuthService: CustomerAuthService,
        private restaurantService: RestaurantService,
        private router: Router,
        private route: ActivatedRoute,
        private restaurantPanelService: RestaurantPanelService,
        private customerService: CustomerService
    ) {}

    // Create a subject to handle search query debouncing
    private searchQuerySubject = new Subject<string>();

    ngOnInit(): void {
        this.checkLogin();
        this.restaurantService.setCartItem([]);
        this.restaurantService.setCartSate(null);
        this.initSearch();
        // Subscribe to the search query subject with debounceTime and distinctUntilChanged
        this.searchQuerySubject
            .pipe(
                debounceTime(500), // Adjust the debounceTime value as needed
                distinctUntilChanged() // Only emit if the search query has changed since the last emission
            )
            .subscribe((query) => {
                this.onSearchInputChanged(query);
            });

        if (this.userLoginFlag) {
            this.getPastRestaurant(
                this.customerAuthService.customerDetail.value
            );
        }
    }
    onSearchInputChanged(query: string) {
        // If the search query is empty, clear the autocomplete results and return
        if (query) {
            // filter the search results
            this.autocompleteResults = this.searchResults.filter((res) => {
                return res.restaurantName
                    .toLowerCase()
                    .includes(query.toLowerCase());
            });
        } else {
            this.autocompleteResults = this.searchResults;
        }
    }

    // Push the search query to the subject for debouncing
    onSearchInput(query: string) {
        this.searchQuerySubject.next(query);
    }

    openLoginDialog() {
        this.dialog.open(UserLoginComponent, {
            minWidth: "400px",
            disableClose: true,
        });
    }

    checkLogin() {
        this.customerAuthService.customerDetail.subscribe({
            next: (res) => {
                if (res) {
                    this.userLoginFlag = true;
                    this.getPastRestaurant(res);
                } else {
                    this.userLoginFlag = false;
                }
            },
        });
    }

    openContactPopUp(data, event: Event) {
        //this.router.navigateByUrl("/")
        event.stopPropagation();
        event.preventDefault();
        this.dialog.open(RestaurantContactPopupComponent, {
            panelClass: "add-item-dialog",
            disableClose: true,
            data: data,
        });
    }

    getPastRestaurant(data) {
        const pastRestaurantData = data.previousRestaurant.map((res) => {
            return res.restaurantId;
        });
        const reqData = {
            pastRestaurantData,
        };
        this.restaurantService.getPastRestaurantData(reqData).subscribe({
            next: (res: any) => {
                if (res && res.data) {
                    this.restaurantData = res.data.restaurantData;
                    console.log(this.restaurantData);
                }
            },
        });
    }

    initSearch() {
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(
        //         (position) => {
        //             console.log("Geolocation position:", position);

        //             this.customerService
        //                 .getNearbyRestaurants(
        //                     position.coords.latitude,
        //                     position.coords.longitude
        //                 )
        //                 .subscribe({
        //                     next: (res: any) => {
        //                         console.log("Nearby restaurants:", res);
        //                         if (res && res.data) {
        //                             this.searchResults =
        //                                 res.data.restaurants;

        //                             console.log(
        //                                 "Search results:",
        //                                 this.searchResults
        //                             );

        //                             // run onSearchInputChanged to filter the search results
        //                             this.onSearchInputChanged(this.searchQuery);
        //                         }
        //                     },
        //                 });
        //         },
        //         (error) => {
        //             console.log("Geolocation error:", error);
        //         }
        //     );
        // }

        this.customerService.getAllRestaurants().subscribe({
            next: (res: any) => {
                console.log("All restaurants:", res);
                if (res && res.data) {
                    this.searchResults = res.data.restaurants;

                    console.log("Search results:", this.searchResults);

                    // run onSearchInputChanged to filter the search results
                    this.onSearchInputChanged(this.searchQuery);
                }
            },
        });
    }

    onSearchIconClick() {
        this.navigateToRestaurant(this.searchResults[0]);

        // console.log("Search icon clicked");

        // console.log("Search query:", this.searchQuery);

        // this.onSearchInputChanged(this.searchQuery);

        // // this.router.navigate(["/search"], {
        // console.log("Search results:", this.searchResults);

        // console.log("Autocomplete results:", this.autocompleteResults);
    }

    selectSearchResult(result) {
        this.navigateToRestaurant(result);
    }

    navigateToRestaurant(data) {
        console.log(data);
        debugger;

        this.router.navigate(["/restaurant"], {
            queryParams: { detail: data.restaurantUrl },
        });
    }
}
