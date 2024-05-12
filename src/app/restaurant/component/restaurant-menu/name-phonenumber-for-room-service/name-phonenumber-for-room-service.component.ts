import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

@Component({
    selector: "app-name-phonenumber-for-room-service",
    templateUrl: "./name-phonenumber-for-room-service.component.html",
    styleUrls: ["./name-phonenumber-for-room-service.component.scss"],
})
export class NamePhonenumberForRoomServiceComponent implements OnInit {
    userForm: FormGroup;
    amountToBePaid: any;
    headingStr = "";
    constructor(
        private dialogRef: MatDialogRef<NamePhonenumberForRoomServiceComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public roomData: any,
        private restaurantService: RestaurantService
    ) {}

    ngOnInit(): void {
        this.setHeadingString();
        this.userForm = this.fb.group({
            name: ["", [Validators.required, Validators.minLength(3)]],
            phoneNumber: [
                "",
                [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
            ], // Indian phone number pattern
        });
        this.restaurantService.amountToBePaidSubject.subscribe({
            next: (res) => {
                this.amountToBePaid = res;
            },
        });
    }
    setHeadingString() {
        if (this.roomData?.takeAway) {
            this.headingStr = ` Contact Details for take away :-  ${this.roomData?.selectedTime}`;
        } else {
            this.headingStr = ` Contact Details for room service at ${this.roomData?.selectedRoom?.roomName}`;
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.userForm.get(fieldName).errors &&
            this.userForm.get(fieldName).errors[errorString] &&
            (this.userForm.get(fieldName).dirty ||
                this.userForm.get(fieldName).touched)
        );
    }
    onSubmit() {
        this.userForm.markAllAsTouched();
        if (this.userForm.valid) {
            const outputData = {
                name: this.userForm.get("name").value,
                phoneNumber: this.userForm.get("phoneNumber").value,
                okFlag: true,
            };
            this.dialogRef.close(outputData);
        }
    }
}
