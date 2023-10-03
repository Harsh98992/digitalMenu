import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
    selector: "app-order-recieved-dialog",
    templateUrl: "./order-recieved-dialog.component.html",
    styleUrls: ["./order-recieved-dialog.component.scss"],
})
export class OrderRecievedDialogComponent implements OnInit {
    constructor(
        private router: Router,
        private dialogRef: MatDialogRef<OrderRecievedDialogComponent>
    ) {}

    ngOnInit(): void {}
    navigateToDashboard() {
        this.router.navigateByUrl("/admin");
        this.dialogRef.close();
    }
}
