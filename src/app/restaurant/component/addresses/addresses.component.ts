import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddAddressMapComponent } from "../restaurant-menu/address/add-address-map/add-address-map.component";
import { CustomerService } from "src/app/api/customer.service";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-addresses",
    templateUrl: "./addresses.component.html",
    styleUrls: ["./addresses.component.scss"],
})
export class AddressesComponent implements OnInit {
    addresses: any[]; // Array of addresses to be fetched or provided

    constructor(
        private dialog: MatDialog,
        private customerService: CustomerService
    ) {}

    ngOnInit(): void {
        // Fetch or provide the list of addresses
        this.getCustomerAddresses();
    }

    openAddAddressDialog() {
        const dialogRef = this.dialog.open(AddAddressMapComponent, {
            disableClose: true,
            panelClass: "add-item-dialog",
            data: {
                showCompleteAddressButton: true,
                editMode: false,
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
                };
                // Send the complete address to the API to save
                this.customerService.addCustomerAddress(data).subscribe(
                    (response) => {
                        // Successfully saved the address
                        console.log("Address saved:", response);

                        this.getCustomerAddresses();
                    },
                    (error) => {
                        // Handle error if saving address fails
                        console.error("Error saving address:", error);
                    }
                );
            }
        });
    }

    deleteAddress(addressId: string) {
        const dialogData = {
            title: "Confirm",
            message: "Are you sure you want to delete this address?",
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

                                this.getCustomerAddresses();
                            });
                    }
                },
            });
    }

    getCustomerAddresses() {
        this.customerService.getCustomer().subscribe(
            (data) => {
                console.log("Data: ", data);
                this.addresses = data["data"]["customer"]["addresses"];
                console.log("Addresses: ", this.addresses);
            },
            (error) => {
                console.error("Error fetching addresses:", error);
            }
        );
    }
}
