import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-delivery-policy',
  templateUrl: './shopping-delivery-policy.component.html',
  styleUrls: ['./shopping-delivery-policy.component.scss']
})
export class ShoppingDeliveryPolicyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

}
