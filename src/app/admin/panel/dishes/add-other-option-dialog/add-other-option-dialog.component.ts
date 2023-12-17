import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-add-other-option-dialog",
    templateUrl: "./add-other-option-dialog.component.html",
    styleUrls: ["./add-other-option-dialog.component.scss"],
})
export class AddOtherOptionDialogComponent implements OnInit {
    choicesForm: FormGroup;
    disableFormFlag = false;
    constructor(
        private restaurantService: RestaurantPanelService,
        private router: Router,
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.generateForm();
    }
    generateForm() {
        this.choicesForm = new FormGroup({
            choicesGroupName: new FormControl("", Validators.required),
            choicesDisplayName: new FormControl("", Validators.required),
            choicesMinValue: new FormControl("", Validators.required),
            choicesMaxValue: new FormControl("", Validators.required),
            choicesGroup: new FormArray([
                new FormGroup({
                    category: new FormControl("", Validators.required),
                    choiceName: new FormControl("", Validators.required),
                    choiceDescription: new FormControl(""),
                }),
            ]),
        });
        if (this.data?.editFlag) {
            this.patchAddOns();
            this.disableFormFlag = true;
            this.choicesForm.disable();
        }
    }
    enableForm() {
        this.disableFormFlag = false;
        this.choicesForm.enable();
    }
    patchAddOns() {
       

        for (let i = 0; i < this.data.choicesGroup.length - 1; i++) {
            this.choicesGroup.push(
                new FormGroup({
                    category: new FormControl("", Validators.required),
                    choiceName: new FormControl("", Validators.required),
                    choiceDescription: new FormControl(""),
                })
            );
        }
        this.choicesForm.patchValue(this.data);
    }
    get choicesGroup(): FormArray {
        return this.choicesForm.get("choicesGroup") as FormArray;
    }
    checkForChoicesError(name: any, fieldName: string, errorString: string) {
        const id = String(name);

        return (
            this.choicesForm.get("choicesGroup").get(id).get(fieldName)
                .errors &&
            this.choicesForm.get("choicesGroup").get(id).get(fieldName).errors[
                errorString
            ] &&
            (this.choicesForm.get("choicesGroup").get(id).get(fieldName)
                .dirty ||
                this.choicesForm.get("choicesGroup").get(id).get(fieldName)
                    .touched)
        );
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.choicesForm.get(fieldName).errors &&
            this.choicesForm.get(fieldName).errors[errorString] &&
            (this.choicesForm.get(fieldName).dirty ||
                this.choicesForm.get(fieldName).touched)
        );
    }
    deleteField(index) {
        this.choicesGroup.removeAt(index);
    }
    saveChoices() {
        this.choicesForm.markAllAsTouched();
        if (!this.choicesForm.valid) {
            return;
        } else if (this.data?.editFlag) {
            const reqData = {
                _id: this.data._id,
                ...this.choicesForm.value,
            };

            this.restaurantService.editDishChoices(reqData).subscribe({
                next: (res) => {
                    this.restaurantService.setRestaurantData();
                    this.dialogRef.close({ apiCallFlag: true });
                },
            });
        } else {
            this.restaurantService
                .addDishChoices(this.choicesForm.value)
                .subscribe({
                    next: (res) => {
                        this.restaurantService.setRestaurantData();
                        this.dialogRef.close({ apiCallFlag: true });
                    },
                });
        }
        // console.log(this.choicesForm.value);
    }
    addChoices() {
        this.choicesForm.markAllAsTouched();
        if (this.choicesGroup.errors) {
            return;
        }

        this.choicesGroup.push(
            new FormGroup({
                category: new FormControl("", Validators.required),
                choiceName: new FormControl("", Validators.required),
                choiceDescription: new FormControl(""),
            })
        );
    }
}
