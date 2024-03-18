import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
  message = "";
  title = "";
  cancelBtnText = "Cancel";
  successBtnText = "Yes";
  constructor(
      private dialogRef: MatDialogRef<any>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
      this.message = this.data.message;
      this.title = this.data.title;
      if (this.data.cancelBtnText) {
          this.cancelBtnText = this.data.cancelBtnText;
      }
      if (this.data.successBtnText) {
          this.successBtnText = this.data.successBtnText;
      }
  }
  okAction() {
      this.dialogRef.close({ okFlag: true });
  }
}
