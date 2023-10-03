import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-repeat-dialog',
  templateUrl: './repeat-dialog.component.html',
  styleUrls: ['./repeat-dialog.component.scss'],
})
export class RepeatDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<any>) {}

  ngOnInit(): void {}
  closeDialog(flag: boolean) {
    console.log(flag);
    
    this.dialogRef.close({ flag });
  }
}
