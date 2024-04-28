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
        private restaurnatService: RestaurantService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        public dialogRef: MatDialogRef<RoomNoDialogComponent>,
        private utilityService: UtilService,
        private customerAuthService: CustomerAuthService,
        private dialog: MatDialog
    ) {}
    ngOnInit(): void {
        this.roomData = this.dialogData.roomData;
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
            if (result?.okFlag) {
                this.dialogRef.close({
                    selectedRoom: this.selectedRoom,
                });
            }
        });
    }
}
