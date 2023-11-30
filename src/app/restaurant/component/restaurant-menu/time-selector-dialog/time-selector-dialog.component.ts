import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { UtilService } from "src/app/api/util.service";

@Component({
    selector: "app-time-selector-dialog",
    templateUrl: "./time-selector-dialog.component.html",
    styleUrls: ["./time-selector-dialog.component.scss"],
})
export class TimeSelectorDialogComponent implements OnInit {
    selectedValue="ASAP"
    ctrl = new FormControl<NgbTimeStruct | null>(
        null,
        (control: FormControl<NgbTimeStruct | null>) => {
            const currentData = new Date();
            const hour = currentData.getHours();
            const min = currentData.getMinutes()+15;
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
        public dialogRef: MatDialogRef<TimeSelectorDialogComponent>
    ) {}

    ngOnInit(): void {
        this.setCurrentTime();
    }
    setCurrentTime() {
        const date=new Date()
        date.setMinutes ( date.getMinutes() + 15 );
        this.ctrl.patchValue({
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        });
    }
    submitTime() {
        if(this.selectedValue==="ASAP"){
            this.dialogRef.close({
                selectedTime: `As soon as possible`,
            });
        }
        else if (!this.ctrl.valid) {
            if (this.ctrl.hasError("earlyTime")) {
                this.utilService.openSnackBar(
                    "Please choose a longer time.",
                    true
                );
            }
        } else {
            this.dialogRef.close({
                selectedTime: `${this.ctrl.value.hour}:${this.ctrl.value.minute}`,
            });
        }
    }
}
