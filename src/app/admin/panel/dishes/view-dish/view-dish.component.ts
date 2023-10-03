import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/angular-material/confirm-dialog/confirm-dialog.component';
import { RestaurantPanelService } from 'src/app/api/restaurant-panel.service';

@Component({
  selector: 'app-view-dish',
  templateUrl: './view-dish.component.html',
  styleUrls: ['./view-dish.component.scss'],
})
export class ViewDishComponent implements OnInit {
  @ViewChild('editTmpl', { static: true }) editTmpl: TemplateRef<any>;
  rows = [];
  columns = [];
  ColumnMode = ColumnMode;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private restaurantService: RestaurantPanelService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getOrders();
    this.columns = [
      { name: 'Actions', prop: 'action' },
      { name: 'Dish Image', prop: 'imageUrl' },
      { name: 'Dish Name', prop: 'dishName' },
      { name: 'Price', prop: 'dishPrice' },
      { name: 'Dish Type', prop: 'dishType' },
      { name: 'Availability', prop: 'availableFlag' },
      { name: 'Dish Order Option', prop: 'dishOrderOption' },

      { name: 'Dish Description', prop: 'dishDescription' },
      { name: 'Spicy', prop: 'chilliFlag' },
    ];
  }
  getOrders() {
    this.restaurantService.restaurantData
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res && res.cuisine) {
            const dishes = this.getAllDishes(res?.cuisine);

            this.rows = dishes;
          }
        },
      });
  }
  navigateToEditDish(row: any) {
    this.restaurantService.setSelectedDish(row);
    this.router.navigate(['/admin/dishes/add-dish'], {
      queryParams: { edit: true },
    });
  }
  getAllDishes(cuisine) {
    const result = [];
    if (cuisine) {
      for (let dish of cuisine) {
        if (dish['items'] && dish['items'].length) {
          console.log(dish['items']);
          const newArray = dish['items'].map((obj) => ({
            ...obj,
            categoryId: dish['_id'],
          }));
          result.push(...newArray);
        }
      }
    }
    return result;
  }
  deleteDish(row: any) {
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
            this.restaurantService
              .deleteDish(row._id, { categoryId: row.categoryId })
              .subscribe({
                next: (res) => {
                  this.restaurantService.setRestaurantData(res);
                },
              });
          }
        },
      });
  }

  // navigateToOrderView(row) {
  //   this.router.navigateByUrl('/admin/restaurant-orders/view');
  // }
}
