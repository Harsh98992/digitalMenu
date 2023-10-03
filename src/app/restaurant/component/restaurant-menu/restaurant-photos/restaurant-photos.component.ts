import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-restaurant-photos',
  templateUrl: './restaurant-photos.component.html',
  styleUrls: ['./restaurant-photos.component.scss'],
})
export class RestaurantPhotosComponent implements OnInit {
  photos = [];
  constructor(@Inject(MAT_DIALOG_DATA) public restaurantData: any) {}

  ngOnInit(): void {
    this.photos = this.restaurantData.restaurantImages;
  }
}
