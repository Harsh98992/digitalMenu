import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RestaurantRoutingModule } from "./restaurant-routing.module";
import { GoogleMapsModule } from "@angular/google-maps";

import { RestaurantMenuComponent } from "./component/restaurant-menu/restaurant-menu.component";
import { RestaurantCartComponent } from "./component/restaurant-menu/restaurant-cart/restaurant-cart.component";
import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { AddItemComponent } from "./component/restaurant-menu/add-item/add-item.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RestaurantPhotosComponent } from "./component/restaurant-menu/restaurant-photos/restaurant-photos.component";
import { RestaurantContactPopupComponent } from "./component/restaurant-menu/restaurant-contact-popup/restaurant-contact-popup.component";
import { MyOrderComponent } from "./component/my-order/my-order.component";
import { RestaurantReviewComponent } from "./component/restaurant-menu/restaurant-review/restaurant-review.component";
import { HomepageComponent } from "./component/homepage/homepage.component";
import { NgxScannerQrcodeModule } from "ngx-scanner-qrcode";
import { QrCodeScannerComponent } from "./component/homepage/qr-code-scanner/qr-code-scanner.component";
import { TimeSelectorDialogComponent } from "./component/restaurant-menu/time-selector-dialog/time-selector-dialog.component";
import { AddressSelectionComponent } from "./component/restaurant-menu/address/address-selection/address-selection.component";
import { AddAddressMapComponent } from "./component/restaurant-menu/address/add-address-map/add-address-map.component";
import { AddCompleteAddressComponent } from "./component/restaurant-menu/address/add-address-map/add-complete-address/add-complete-address.component";
import { ShowOptionDialogComponent } from "./component/restaurant-menu/restaurant-cart/show-option-dialog/show-option-dialog.component";
import { LayoutComponent } from "./component/layout/layout.component";
import { OrderSuccessComponent } from "./component/order-success/order-success.component";
import { CustomerProfileComponent } from "./component/customer-profile/customer-profile.component";
import { AddressesComponent } from "./component/addresses/addresses.component";
import { CustomerAddressComponent } from "./component/customer-profile/customer-address/customer-address.component";
import { CartHelperComponent } from "./component/restaurant-menu/cart-helper/cart-helper.component";
import { TableNumberDialogComponent } from "./component/restaurant-menu/table-number-dialog/table-number-dialog.component";
import { FooterComponent } from "./component/layout/footer/footer.component";
import { UserPromoCodeDialogComponent } from "./component/restaurant-menu/cart-helper/user-promo-code-dialog/user-promo-code-dialog.component";
import { PrivacyPolicyComponent } from "./component/policy/privacy-policy/privacy-policy.component";
import { TermsConditionComponent } from "./component/policy/terms-condition/terms-condition.component";
import { CancellationPolicyComponent } from "./component/policy/cancellation-policy/cancellation-policy.component";
import { ShoppingDeliveryPolicyComponent } from "./component/policy/shopping-delivery-policy/shopping-delivery-policy.component";
import { OrderTrackingComponent } from "./component/order-tracking/order-tracking.component";
import { PromoCodeDetailsDialogComponent } from "./component/restaurant-menu/cart-helper/promo-code-details-dialog/promo-code-details-dialog.component";
import { AddMissingInfoDialogComponent } from './component/restaurant-menu/add-missing-info-dialog/add-missing-info-dialog.component';
import { RoomNoDialogComponent } from './component/restaurant-menu/room-no-dialog/room-no-dialog.component';
import { NamePhonenumberForRoomServiceComponent } from './component/restaurant-menu/name-phonenumber-for-room-service/name-phonenumber-for-room-service.component';

@NgModule({
    declarations: [
        RestaurantMenuComponent,
        RestaurantCartComponent,
        AddItemComponent,
        RestaurantPhotosComponent,
        RestaurantContactPopupComponent,
        MyOrderComponent,
        RestaurantReviewComponent,
        HomepageComponent,
        QrCodeScannerComponent,
        TimeSelectorDialogComponent,
        AddressSelectionComponent,
        AddAddressMapComponent,
        AddCompleteAddressComponent,
        ShowOptionDialogComponent,
        LayoutComponent,
        OrderSuccessComponent,
        CustomerProfileComponent,
        AddressesComponent,
        CustomerAddressComponent,
        CartHelperComponent,
        TableNumberDialogComponent,
        FooterComponent,
        UserPromoCodeDialogComponent,
        PrivacyPolicyComponent,
        TermsConditionComponent,
        CancellationPolicyComponent,
        ShoppingDeliveryPolicyComponent,
        OrderTrackingComponent,
        PromoCodeDetailsDialogComponent,
        AddMissingInfoDialogComponent,
        RoomNoDialogComponent,
        NamePhonenumberForRoomServiceComponent,
    ],
    imports: [
        CommonModule,
        RestaurantRoutingModule,
        AngularMaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgxScannerQrcodeModule,

        GoogleMapsModule,
    ],
})
export class RestaurantModule {}
