import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RestaurantMenuComponent } from "./component/restaurant-menu/restaurant-menu.component";
import { MyOrderComponent } from "./component/my-order/my-order.component";
import { HomepageComponent } from "./component/homepage/homepage.component";
import { QrCodeScannerComponent } from "./component/homepage/qr-code-scanner/qr-code-scanner.component";
import { LayoutComponent } from "./component/layout/layout.component";
import { CustomerAuthGuard } from "./api/customer-auth.guard";
import { OrderSuccessComponent } from "./component/order-success/order-success.component";
import { CustomerProfileComponent } from "./component/customer-profile/customer-profile.component";
import { ContactUsComponent } from "../angular-material/contact-us/contact-us.component";
import { AddressesComponent } from "./component/addresses/addresses.component";
import { PrivacyPolicyComponent } from "./component/policy/privacy-policy/privacy-policy.component";
import { TermsConditionComponent } from "./component/policy/terms-condition/terms-condition.component";
import { CancellationPolicyComponent } from "./component/policy/cancellation-policy/cancellation-policy.component";
import { ShoppingDeliveryPolicyComponent } from "./component/policy/shopping-delivery-policy/shopping-delivery-policy.component";
import { OrderTrackingComponent } from "./component/order-tracking/order-tracking.component";
import { RestaurantMenuGuard } from "./api/restaurant-menu.guard";
import { TrackOrderComponent } from "./component/track-order/track-order.component";

const routes: Routes = [
    {
        path: "",
        component: LayoutComponent,
        children: [
            { path: "", component: HomepageComponent },
            { path: "restaurant", component: RestaurantMenuComponent,canDeactivate:[RestaurantMenuGuard] },
            {
                path: "orders",
                component: MyOrderComponent,
                canActivate: [CustomerAuthGuard],
            },
            {
                path: "privacy-policy",
                component: PrivacyPolicyComponent,
            },
            {
                path: "terms-condition",
                component: TermsConditionComponent,
            },
            {
                path: "cancellation-refund-policy",
                component: CancellationPolicyComponent,
            },
            {
                path: "shipping-delivery-policy",
                component: ShoppingDeliveryPolicyComponent,
            },
            {
                path: "order-tracking/:orderId/:restaurantId",
                component: OrderTrackingComponent,
            },
            {
                path: "addresses",
                component: AddressesComponent,
            },
            {
                path: "trackOrder",
                component: TrackOrderComponent,
            },

            {
                path: "customer-profile",
                component: CustomerProfileComponent,
                canActivate: [CustomerAuthGuard],
            },
            {
                path: "contact",
                component: ContactUsComponent,
            },
            {
                path: "ordersuccessful",
                component: OrderSuccessComponent,
                canActivate: [CustomerAuthGuard],
            },
            { path: "scanner", component: QrCodeScannerComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RestaurantRoutingModule {}
