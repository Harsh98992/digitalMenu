import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from '../../order-dialog/cancel-dialog/cancel-dialog.component';
import { AcceptDialogComponent } from '../../order-dialog/accept-dialog/accept-dialog.component';

@Component({
  selector: 'app-order-accept',
  templateUrl: './order-accept.component.html',
  styleUrls: ['./order-accept.component.scss'],
})
export class OrderAcceptComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
  openCancelOrderDialog() {
    let dialogRef = this.dialog.open(CancelDialogComponent, {
      disableClose: true,
      panelClass: 'app-full-bleed-dialog',
    });
  }
  openAcceptDialog() {
    let dialogRef = this.dialog.open(AcceptDialogComponent, {
      disableClose: true,
      panelClass: 'app-full-bleed-dialog',
    });
  }
}
