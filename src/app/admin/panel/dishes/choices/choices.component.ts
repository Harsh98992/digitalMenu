import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddOtherOptionDialogComponent } from '../add-other-option-dialog/add-other-option-dialog.component';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { RestaurantPanelService } from 'src/app/api/restaurant-panel.service';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/angular-material/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.scss'],
})
export class ChoicesComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: DatatableComponent;
  rows = [];
  columns = [];
  ColumnMode = ColumnMode;
  destroy$: Subject<boolean> = new Subject<boolean>();
  extraIngredents = [];
  searchTerm = '';
  filteredData: any;
  constructor(
    public dialog: MatDialog,
    private restaurantService: RestaurantPanelService
  ) {}

  ngOnInit(): void {
    this.generateTable();
    this.getRestaurantData();
  }
  getRestaurantData() {
    this.restaurantService.restaurantData
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res && res.addOns) {
            this.rows = res.dishChoices;
            this.applyFilter()
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
    if(this.table){

      this.table.offset = 0; // Reset pagination to the first page
    }
  }
  generateTable() {
    this.columns = [
      { name: 'Actions', prop: 'action' },
      { name: 'Chocies Group Name', prop: 'choicesGroupName' },
      { name: 'Choices Display Name', prop: 'choicesDisplayName' },
      { name: 'Min Value', prop: 'choicesMinValue' },
      { name: 'Max Value', prop: 'choicesMaxValue' },
    ];
  }
  editDishChoices(row) {
    console.log(row);
    
    let dialogRef = this.dialog.open(AddOtherOptionDialogComponent, {
      disableClose: true,
      panelClass: 'app-full-order-dialog',
      minWidth: '70%',
      data: {
        ...row,
        editFlag: true,
      },
    });
  }
  openAddChoiceDialog() {
    let dialogRef = this.dialog.open(AddOtherOptionDialogComponent, {
      disableClose: true,
      panelClass: 'app-full-order-dialog',
      minWidth: '70%',
    });
  }
  deleteDishChoices(row) {
    const dialogData = {
      title: 'Confirm',
      message: 'Are you sure you want to delete this item?',
    };
    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe({
        next: (res: any) => {
          if (res && res.okFlag) {
            this.restaurantService.deleteChoices(row._id).subscribe({
              next: (res) => {
                this.restaurantService.setRestaurantData();
              },
            });
          }
        },
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
