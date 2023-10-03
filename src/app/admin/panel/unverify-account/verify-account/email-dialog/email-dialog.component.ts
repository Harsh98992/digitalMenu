import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-email-dialog",
    templateUrl: "./email-dialog.component.html",
    styleUrls: ["./email-dialog.component.scss"],
})
export class EmailDialogComponent {
    message: string;

    constructor(
        public dialogRef: MatDialogRef<EmailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { message: string }
    ) {
        this.message = data.message;
    }

    onSendClick(): void {
        this.dialogRef.close(this.message);
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
    
}
