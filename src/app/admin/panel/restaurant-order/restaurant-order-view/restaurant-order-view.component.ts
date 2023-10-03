import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { RestaurantPanelService } from 'src/app/api/restaurant-panel.service';

@Component({
  selector: 'app-restaurant-order-view',
  templateUrl: './restaurant-order-view.component.html',
  styleUrls: ['./restaurant-order-view.component.scss'],
})
export class RestaurantOrderViewComponent implements OnInit {
  rows = [];
  ColumnMode = ColumnMode;
  constructor(private restaurantService: RestaurantPanelService) {}

  ngOnInit(): void {
    this.getOrders();
  }
  getOrders() {
    this.restaurantService.getResataurantOrder().subscribe({
      next: (res: any) => {
        this.rows = res;
      },
    });
  }
}
