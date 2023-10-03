import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RestaurantPanelService } from 'src/app/api/restaurant-panel.service';
import { UtilService } from 'src/app/api/util.service';

@Component({
  selector: 'app-add-extra',
  templateUrl: './add-extra.component.html',
  styleUrls: ['./add-extra.component.scss'],
})
export class AddExtraComponent implements OnInit {
  extraForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantPanelService,
    private dialogRef: MatDialog,
    private utilService: UtilService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeExtraForm();
  }
  checkEditForm() {
    if (this.data && this.data.editFlag) {
      this.extraForm.patchValue(this.data);
    }
  }
  initializeExtraForm() {
    this.extraForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });
    this.checkEditForm();
  }
  submitForm() {
    const reqData = {
      name: this.extraForm.get('name').value,
      price: this.extraForm.get('price').value,
    };
    if (!this.extraForm.valid) {
      this.extraForm.markAllAsTouched();
      return;
    } else if (this.data && this.data.editFlag) {
      reqData['id']=this.data._id
      this.restaurantService.editExtraIngredient(reqData).subscribe({
        next: (res: any) => {
          this.restaurantService.setRestaurantData(res);
          
          this.dialogRef.closeAll();
        },
      });
    } else {
      this.restaurantService.addExtraIngredient(reqData).subscribe({
        next: (res: any) => {
          this.restaurantService.setRestaurantData(res);
          
          this.dialogRef.closeAll();
        },
      });
    }
  }
  checkForError(fieldName: string, errorString: string) {
    return (
      this.extraForm.get(fieldName).errors &&
      this.extraForm.get(fieldName).errors[errorString] &&
      (this.extraForm.get(fieldName).dirty ||
        this.extraForm.get(fieldName).touched)
    );
  }
}
