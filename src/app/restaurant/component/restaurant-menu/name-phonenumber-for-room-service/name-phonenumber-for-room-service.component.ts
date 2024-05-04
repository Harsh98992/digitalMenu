import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-name-phonenumber-for-room-service",
    templateUrl: "./name-phonenumber-for-room-service.component.html",
    styleUrls: ["./name-phonenumber-for-room-service.component.scss"],
})
export class NamePhonenumberForRoomServiceComponent implements OnInit {
    userForm: FormGroup;
    constructor(
        private dialogRef: MatDialogRef<NamePhonenumberForRoomServiceComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public roomData: any
    ) {}

    ngOnInit(): void {
        console.log(this.roomData);
        
        this.userForm = this.fb.group({
            name: ["", [Validators.required, Validators.minLength(3)]],
            phoneNumber: [
                "",
                [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
            ], // Indian phone number pattern
        });
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
          const outputData={
            name:this.userForm.get('name').value,
            phoneNumber:this.userForm.get('phoneNumber').value,
            okFlag:true
          }
            this.dialogRef.close(outputData);
        }
    }
}
