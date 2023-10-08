import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-add-table",
    templateUrl: "./add-table.component.html",
    styleUrls: ["./add-table.component.scss"],
})
export class AddTableComponent implements OnInit {
    tableForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private restaurantPanelService: RestaurantPanelService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddTableComponent>,
    ) {}

    ngOnInit(): void {
        this.generateForm();
    }
    generateForm() {
        this.tableForm = this.formBuilder.group({
            tableName: ["", Validators.required],
            availability: ["true", Validators.required],
            capacity: ["4", Validators.required],
        });
        this.checkForEdit();
    }
    checkForEdit() {
        if (this.data) {
            const patchData = {
                tableName: this.data["tableName"],
                capacity: this.data["capacity"],
                availability: this.data["isAvailable"],
            };
            this.tableForm.patchValue(patchData);
        }
    }
    submitForm() {
        this.tableForm.markAllAsTouched();
        if (this.tableForm.valid) {
            if (this.data) {
                const reqData = {
                    tableId: this.data._id,
                    tableName: this.tableForm.get("tableName").value,
                    capacity: this.tableForm.get("capacity").value,
                    isAvailable: this.tableForm.get("availability").value,
                };
                this.restaurantPanelService.updateTable(reqData).subscribe({
                    next: (res) => {
                        this.dialogRef.close({ apiCallFlag: true });
                    },
                });
            } else {
                const reqData = {
                    tableName: this.tableForm.get("tableName").value,
                    capacity: this.tableForm.get("capacity").value,
                    isAvailable: this.tableForm.get("availability").value,
                };
                this.restaurantPanelService
                    .createTableEntry(reqData)
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
            this.tableForm.get(fieldName).errors &&
            this.tableForm.get(fieldName).errors[errorString] &&
            (this.tableForm.get(fieldName).dirty ||
                this.tableForm.get(fieldName).touched)
        );
    }
}
