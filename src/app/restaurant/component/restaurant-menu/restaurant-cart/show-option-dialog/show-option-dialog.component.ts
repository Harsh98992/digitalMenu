import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "app-show-option-dialog",
    templateUrl: "./show-option-dialog.component.html",
    styleUrls: ["./show-option-dialog.component.scss"],
})
export class ShowOptionDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public dishData: any) {}

    ngOnInit(): void {
      console.log(this.dishData);
      
    }
}
