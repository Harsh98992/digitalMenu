import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { AddRoomComponent } from "./add-room/add-room.component";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-restaurant-room",
    templateUrl: "./restaurant-room.component.html",
    styleUrls: ["./restaurant-room.component.scss"],
})
export class RestaurantRoomComponent implements OnInit {
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    rows = [];

    ColumnMode = ColumnMode;
    searchTerm = "";
    filteredData: any;
    columns = [];
    constructor(
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService
    ) {}

    ngOnInit(): void {
        this.getRoomData();
        this.initalizeTable();
    }
    initalizeTable() {
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Room Name", prop: "roomName" },
          
        ];
    }
    getRoomData() {
        this.restaurantService.getAllRooms().subscribe({
            next: (res: any) => {
                if (res && res.data) {
                    this.rows = res.data.rooms.room;
                }
            },
        });
    }
    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();

        this.filteredData = this.rows.filter((row) => {
            return Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );
        });
        this.table.offset = 0; // Reset pagination to the first page
    }
    openAddRoomDialog(row) {
      let dialogRef = this.dialog.open(AddRoomComponent, {
          disableClose: true,
          panelClass: "app-full-bleed-dialog",

          data: row,
      });
      dialogRef.afterClosed().subscribe((result) => {
          if (result && result.apiCallFlag) {
              this.getRoomData();
          }
      });
  }
  deleteRoomDialog(row) {
    const dialogData = {
        title: "Confirm",
        message: "Are you sure you want to delete this item?",
    };
    this.dialog
        .open(ConfirmDialogComponent, { data: dialogData })
        .afterClosed()
        .subscribe({
            next: (res: any) => {
                if (res && res.okFlag) {
                    this.restaurantService
                        .deleteRoomById(row._id)
                        .subscribe({
                            next: (res) => {
                                this.getRoomData();
                            },
                        });
                }
            },
        });
}
}
