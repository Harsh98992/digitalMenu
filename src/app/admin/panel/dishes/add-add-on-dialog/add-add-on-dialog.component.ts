import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RestaurantPanelService } from 'src/app/api/restaurant-panel.service';

@Component({
  selector: 'app-add-add-on-dialog',
  templateUrl: './add-add-on-dialog.component.html',
  styleUrls: ['./add-add-on-dialog.component.scss'],
})
export class AddAddOnDialogComponent implements OnInit {
  addOnForm: FormGroup;
  disableFlag = false;
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
    this.addOnForm = new FormGroup({
      addOnGroupName: new FormControl('', Validators.required),
      addOnDisplayName: new FormControl('', Validators.required),
      addOnMinValue: new FormControl('', Validators.required),
      addOnMaxValue: new FormControl('', Validators.required),
      addOns: new FormArray([
        new FormGroup({
          category: new FormControl('', Validators.required),
          addOnName: new FormControl('', Validators.required),
          addOnPrice: new FormControl('', Validators.required),
        }),
      ]),
    });
    if (this.data?.editFlag) {
      this.disableFlag = true;
      this.addOnForm.disable();
      this.patchAddOns();
    }
  }
  enableForm() {
    this.disableFlag=false
    this.addOnForm.enable();
  }
  patchAddOns() {
    for (let i = 0; i < this.data.addOns.length - 1; i++) {
      this.addOns.push(
        new FormGroup({
          category: new FormControl('', Validators.required),
          addOnName: new FormControl('', Validators.required),
          addOnPrice: new FormControl('', Validators.required),
        })
      );
    }
    this.addOnForm.patchValue(this.data);
  }
  get addOns(): FormArray {
    return this.addOnForm.get('addOns') as FormArray;
  }
  checkForVariantsError(name: any, fieldName: string, errorString: string) {
    const id = String(name);

    return (
      this.addOnForm.get('addOns').get(id).get(fieldName).errors &&
      this.addOnForm.get('addOns').get(id).get(fieldName).errors[errorString] &&
      (this.addOnForm.get('addOns').get(id).get(fieldName).dirty ||
        this.addOnForm.get('addOns').get(id).get(fieldName).touched)
    );
  }
  checkForError(fieldName: string, errorString: string) {
    return (
      this.addOnForm.get(fieldName).errors &&
      this.addOnForm.get(fieldName).errors[errorString] &&
      (this.addOnForm.get(fieldName).dirty ||
        this.addOnForm.get(fieldName).touched)
    );
  }
  deleteField(index) {
    this.addOns.removeAt(index);
  }
  saveAddOn() {
    this.addOnForm.markAllAsTouched();
    if (!this.addOnForm.valid) {
      return;
    } else if (this.data?.editFlag) {
      const reqData = {
        _id: this.data._id,
        ...this.addOnForm.value,
      };
      this.restaurantService.editAddons(reqData).subscribe({
        next: (res) => {
          this.restaurantService.setRestaurantData();
          this.dialogRef.close({ apiCallFlag: true });
        },
      });
    } else {
      this.restaurantService.addAddons(this.addOnForm.value).subscribe({
        next: (res) => {
          this.restaurantService.setRestaurantData();
          this.dialogRef.close({ apiCallFlag: true });
        },
      });
    }
    // console.log(this.addOnForm.value);
  }
  addAddOns() {
    this.addOnForm.markAllAsTouched();
    if (!this.addOns.valid) {
      return;
    }

    this.addOns.push(
      new FormGroup({
        category: new FormControl('', Validators.required),
        addOnName: new FormControl('', Validators.required),
        addOnPrice: new FormControl('', Validators.required),
      })
    );
  }
}
