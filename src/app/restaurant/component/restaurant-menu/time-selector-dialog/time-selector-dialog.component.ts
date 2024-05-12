import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { UtilService } from "src/app/api/util.service";
import { NamePhonenumberForRoomServiceComponent } from "../name-phonenumber-for-room-service/name-phonenumber-for-room-service.component";

@Component({
    selector: "app-time-selector-dialog",
    templateUrl: "./time-selector-dialog.component.html",
    styleUrls: ["./time-selector-dialog.component.scss"],
})
export class TimeSelectorDialogComponent implements OnInit {
    selectedValue = "ASAP";

    ctrl = new FormControl<NgbTimeStruct | null>(
        null,
        (control: FormControl<NgbTimeStruct | null>) => {
            const currentData = new Date();
            const hour = currentData.getHours();
            const min = currentData.getMinutes() + 15;
            const value = control.value;

            if (!value) {
                return null;
            }
            const currDateStr = `${hour.toString().padStart(2, "0")}:${min
                .toString()
                .padStart(2, "0")}`;
            const userEnterStr = `${value.hour
                .toString()
                .padStart(2, "0")}:${value.minute.toString().padStart(2, "0")}`;

            if (currDateStr > userEnterStr) {
                return {
                    earlyTime: true,
                };
            }

            return null;
        }
    );
    constructor(
        private utilService: UtilService,
        public dialogRef: MatDialogRef<TimeSelectorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.setCurrentTime();
    }
    setCurrentTime() {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 15);
        this.ctrl.patchValue({
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        });
    }
    submitTime() {
        if (!this.ctrl.valid && this.selectedValue !== "ASAP") {
            if (this.ctrl.hasError("earlyTime")) {
                this.utilService.openSnackBar(
                    "Please choose a longer time.",
                    true
                );
                return;
            }
        }
        const selectedTime =
            this.selectedValue === "ASAP"
                ? "ASAP"
                : `${this.ctrl.value.hour
                      .toString()
                      .padStart(2, "0")}:${this.ctrl.value.minute
                      .toString()
                      .padStart(2, "0")}`;
        const dial = this.dialog.open(NamePhonenumberForRoomServiceComponent, {
            panelClass: "add-item-dialog",
            data: { selectedTime, takeAway: true },
        });
        dial.afterClosed().subscribe((re) => {
            if (re?.okFlag) {
                if (this.selectedValue === "ASAP") {
                    this.dialogRef.close({
                        selectedTime: `ASAP`,
                        name: re?.name,
                        phoneNumber: re?.phoneNumber,
                    });
                } else if (!this.ctrl.valid) {
                    if (this.ctrl.hasError("earlyTime")) {
                        this.utilService.openSnackBar(
                            "Please choose a longer time.",
                            true
                        );
                    }
                } else {
                    this.dialogRef.close({
                        selectedTime: `${this.ctrl.value.hour
                            .toString()
                            .padStart(2, "0")}:${this.ctrl.value.minute
                            .toString()
                            .padStart(2, "0")}`,
                        name: re?.name,
                        phoneNumber: re?.phoneNumber,
                    });
                }
                // Close dialog and pass selectedRoom, name, and phoneNumber to the parent component
            }
        });
    }
}
