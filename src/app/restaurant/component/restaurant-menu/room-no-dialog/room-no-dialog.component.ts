import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { UtilService } from "src/app/api/util.service";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";
import { NamePhonenumberForRoomServiceComponent } from "../name-phonenumber-for-room-service/name-phonenumber-for-room-service.component";
import { CustomerDetailsService } from "src/app/api/customer-details.service";

@Component({
    selector: "app-room-no-dialog",
    templateUrl: "./room-no-dialog.component.html",
    styleUrls: ["./room-no-dialog.component.scss"],
})
export class RoomNoDialogComponent implements OnInit {
    form: FormGroup;
    restaurantData: any;
    tableData: any;
    selectedRoom: any;
    customerDetailId: any;
    roomData: any;
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        public dialogRef: MatDialogRef<RoomNoDialogComponent>,
        private utilityService: UtilService,
        private customerDetailsService: CustomerDetailsService,
        private dialog: MatDialog,
        private restaurantService: RestaurantService
    ) {}
    ngOnInit(): void {
        this.restaurantData = this.dialogData.restaurantData;
        this.getRestaurantRoom();
    }
    getRestaurantRoom() {
        const reqBody = {
            restaurantKey: this.restaurantData._id,
        };
        this.restaurantService.getAllRoomsRestaurant(reqBody).subscribe({
            next: (res: any) => {
                if (res && res.data) {
                    this.roomData = res.data?.rooms?.room;
                }
            },
        });
    }
    onSubmit() {
        if (!this.selectedRoom) {
            this.utilityService.openSnackBar("Please select a room", true);
            return;
        }
        const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: "Place Order",
                message: `Place Your Order Now for Room Number ${this.selectedRoom.roomName}!`,
            },
        });
        confirmDialog.afterClosed().subscribe((result) => {
            const dial = this.dialog.open(
                NamePhonenumberForRoomServiceComponent,
                {
                    data: {
                        name: "",
                        phoneNumber: "",
                    },
                }
            );

            dial.afterClosed().subscribe((re) => {
                if (result?.okFlag) {
                    // Store customer details using the service
                    this.customerDetailsService.storeCustomerDetails(
                        re?.name,
                        re?.phoneNumber
                    );
                    // Close dialog and pass selectedRoom, name, and phoneNumber to the parent component
                    this.dialogRef.close({
                        selectedRoom: this.selectedRoom,
                        name: re?.name,
                        phoneNumber: re?.phoneNumber,
                    });
                }
            });
        });
    }
}
