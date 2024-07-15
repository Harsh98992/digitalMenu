import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AcceptOrderWhatsappComponent } from "./accept-order-whatsapp/accept-order-whatsapp.component";

const routes: Routes = [
    {
        path: "accept-order-whatsapp/:orderId",
        component: AcceptOrderWhatsappComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderRoutingModule {}
