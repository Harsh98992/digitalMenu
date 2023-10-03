import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from './cancel-dialog/cancel-dialog.component';
import { AcceptDialogComponent } from './accept-dialog/accept-dialog.component';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss'],
})
export class OrderDialogComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
  openCancelOrderDialog() {
    let dialogRef = this.dialog.open(CancelDialogComponent, {
      disableClose: true,
      panelClass: 'app-full-bleed-dialog',
    });
  }
  openAcceptDialog(){
    let dialogRef = this.dialog.open(AcceptDialogComponent, {
      disableClose: true,
      panelClass: 'app-full-bleed-dialog',
     
    });
  }
}
