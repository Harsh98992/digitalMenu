import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { AcceptOrderWhatsappComponent } from './accept-order-whatsapp/accept-order-whatsapp.component';


@NgModule({
  declarations: [
    AcceptOrderWhatsappComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
