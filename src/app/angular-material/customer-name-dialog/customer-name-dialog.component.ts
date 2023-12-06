// customer-name-dialog.component.ts
import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-customer-name-dialog",
  templateUrl: "./customer-name-dialog.component.html",
  styleUrls: ["./customer-name-dialog.component.scss"],
})
export class CustomerNameDialogComponent implements OnInit {
  nameForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<CustomerNameDialogComponent>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.nameForm = this.fb.group({
      customerName: ["", Validators.required],
    });
  }

  submitForm(): void {
    this.nameForm.markAllAsTouched();
    if (this.nameForm.valid) {
      const customerName = this.nameForm.get("customerName").value;
      this.dialogRef.close(customerName);
    }
  }

  checkForError(fieldName: string, errorString: string): boolean {
    return (
      this.nameForm.get(fieldName).errors &&
      this.nameForm.get(fieldName).errors[errorString] &&
      (this.nameForm.get(fieldName).dirty || this.nameForm.get(fieldName).touched)
    );
  }
}
