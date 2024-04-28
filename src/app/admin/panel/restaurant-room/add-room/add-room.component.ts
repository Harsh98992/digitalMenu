import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-add-room",
    templateUrl: "./add-room.component.html",
    styleUrls: ["./add-room.component.scss"],
})
export class AddRoomComponent implements OnInit {
    roomForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private restaurantPanelService: RestaurantPanelService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddRoomComponent>
    ) {}

    ngOnInit(): void {
        this.generateForm();
    }
    generateForm() {
        this.roomForm = this.formBuilder.group({
            roomName: ["", Validators.required],
        });
        this.checkForEdit();
    }
    checkForEdit() {
        if (this.data) {
            const patchData = {
                roomName: this.data["roomName"],
            };
            this.roomForm.patchValue(patchData);
        }
    }
    submitForm() {
        this.roomForm.markAllAsTouched();
        if (this.roomForm.valid) {
            if (this.data) {
                const reqData = {
                    roomId: this.data._id,
                    roomName: this.roomForm.get("roomName").value,
                };
                this.restaurantPanelService.updateRoom(reqData).subscribe({
                    next: (res) => {
                        this.dialogRef.close({ apiCallFlag: true });
                    },
                });
            } else {
                const reqData = {
                    roomName: this.roomForm.get("roomName").value,
                };
                this.restaurantPanelService
                    .createRoomEntry(reqData)
                    .subscribe({
                        next: (res) => {
                            this.dialogRef.close({ apiCallFlag: true });
                        },
                    });
                // You can perform further actions here, such as sending the data to a server.
            }
        }
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.roomForm.get(fieldName).errors &&
            this.roomForm.get(fieldName).errors[errorString] &&
            (this.roomForm.get(fieldName).dirty ||
                this.roomForm.get(fieldName).touched)
        );
    }
}
