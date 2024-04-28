import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
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
    selectedTable: any;
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
        console.log(this.roomData);
    }
    onSubmit() {}
}
