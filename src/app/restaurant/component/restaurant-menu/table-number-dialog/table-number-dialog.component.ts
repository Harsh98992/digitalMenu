import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

@Component({
    selector: "app-table-number-dialog",
    templateUrl: "./table-number-dialog.component.html",
    styleUrls: ["./table-number-dialog.component.scss"],
})
export class TableNumberDialogComponent implements OnInit {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private restaurnatService: RestaurantService,
        @Inject(MAT_DIALOG_DATA) public restaurantData: any,
        public dialogRef: MatDialogRef<TableNumberDialogComponent>
    ) {}

    ngOnInit(): void {
        this.generateForm();
    }
    generateForm() {
        this.form = this.fb.group({
            tableName: [null, Validators.required],
        });
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.form.get(fieldName).errors &&
            this.form.get(fieldName).errors[errorString] &&
            (this.form.get(fieldName).dirty || this.form.get(fieldName).touched)
        );
    }
    onSubmit() {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            const reqData = {
                tableName: this.form.get("tableName").value,
                restaurantId: this.restaurantData._id,
            };
            this.restaurnatService
                .checkDineInTableAvailability(reqData)
                .subscribe({
                    next: (res) => {
                        this.dialogRef.close({
                            selectedTableName: this.form.get("tableName").value,
                        });
                    },
                });
        }
    }
}
