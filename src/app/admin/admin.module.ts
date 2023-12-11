import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material/angular-material.module";

import { LayoutComponent } from "./layout/layout.component";

import { DashboardComponent } from "./panel/dashboard/dashboard.component";
import { RestaurantProfileComponent } from "./panel/restaurant-profile/restaurant-profile.component";

import { EmailOtpComponent } from "./panel/restaurant-profile/email-otp/email-otp.component";
import { RestaurantGalleryComponent } from "./panel/restaurant-gallery/restaurant-gallery.component";
import { ImageUploadComponent } from "./panel/restaurant-gallery/image-upload/image-upload.component";
import { RestaurantOrderComponent } from "./panel/restaurant-order/restaurant-order.component";
import { ViewUserComponent } from "./panel/user-managment/view-user/view-user.component";
import { AddUserComponent } from "./panel/user-managment/add-user/add-user.component";
import { RestaurantOrderViewComponent } from "./panel/restaurant-order/restaurant-order-view/restaurant-order-view.component";
import { CustomersComponent } from "./panel/customers/customers.component";
import { CouponComponent } from "./panel/marketing/coupon/coupon.component";
import { OrderDialogComponent } from "./layout/order-dialog/order-dialog.component";
import { CancelDialogComponent } from "./layout/order-dialog/cancel-dialog/cancel-dialog.component";
import { AcceptDialogComponent } from "./layout/order-dialog/accept-dialog/accept-dialog.component";
import { ReviewComponent } from "./panel/review/review.component";
import { StoreComponent } from "./panel/settings/store/store.component";
import { ResetPasswordComponent } from "./panel/profile/reset-password/reset-password.component";
import { OrderAcceptComponent } from "./layout/order/order-accept/order-accept.component";
import { ExtrasComponent } from "./panel/dishes/extras/extras.component";
import { AddExtraComponent } from "./panel/dishes/extras/add-extra/add-extra.component";
import { ViewDishComponent } from "./panel/dishes/view-dish/view-dish.component";
import { AddDishComponent } from "./panel/dishes/add-dish/add-dish.component";
import { AddCategoryDialogComponent } from "./panel/dishes/add-category-dialog/add-category-dialog.component";
import { AddAddOnDialogComponent } from "./panel/dishes/add-add-on-dialog/add-add-on-dialog.component";
import { AddRestaurantComponent } from "./panel/restaurant-request/add-restaurant/add-restaurant.component";
import { UnverifyAccountComponent } from "./panel/unverify-account/unverify-account.component";
import { VerifyAccountComponent } from "./panel/unverify-account/verify-account/verify-account.component";
import { AddOtherOptionDialogComponent } from "./panel/dishes/add-other-option-dialog/add-other-option-dialog.component";
import { ChoicesComponent } from "./panel/dishes/choices/choices.component";
import { EditUserComponent } from "./panel/user-managment/edit-user/edit-user.component";
import { UserProfileComponent } from "./panel/user-profile/user-profile.component";
import { OrderAcceptDialogComponent } from "../angular-material/order-accept-dialog/order-accept-dialog.component";
import { ViewUsersComponent } from "./panel/unverify-account/view-users/view-users.component";
import { EmailDialogComponent } from "./panel/unverify-account/verify-account/email-dialog/email-dialog.component";
import { RestaurantQrCodeComponent } from "./panel/restaurant-qr-code/restaurant-qr-code.component";
import { CategoriesComponent } from "./panel/dishes/categories/categories.component";
import { AddContactDetailsComponent } from "./panel/restaurant-contact-details/add-contact/add-contact-detail/add-contact-detail.component";
import { RestaurantContactDetailsComponent } from "./panel/restaurant-contact-details/restaurant-contact-detail.component";
import { RestaurantTablesComponent } from "./panel/restaurant-tables/restaurant-tables.component";
import { AddTableComponent } from "./panel/restaurant-tables/add-table/add-table.component";
import { PromocodeComponent } from "./panel/promocode/promocode.component";
import { PromoCodeListComponent } from './panel/promo-code-list/promo-code-list.component';
import { AddPaymentComponent } from './panel/settings/add-payment/add-payment.component';
import { verifiedComponent } from './panel/unverify-account/verified/verified.component';

@NgModule({
    declarations: [
        LayoutComponent,
        DashboardComponent,
        RestaurantProfileComponent,
        EmailOtpComponent,
        RestaurantGalleryComponent,
        ImageUploadComponent,
        RestaurantOrderComponent,
        ViewUserComponent,
        AddUserComponent,
        RestaurantOrderViewComponent,
        CustomersComponent,
        CouponComponent,
        OrderDialogComponent,
        CancelDialogComponent,
        AcceptDialogComponent,
        ReviewComponent,
        StoreComponent,
        ResetPasswordComponent,
        OrderAcceptComponent,
        ExtrasComponent,
        AddExtraComponent,
        ViewDishComponent,
        AddDishComponent,
        AddCategoryDialogComponent,
        AddAddOnDialogComponent,
        AddRestaurantComponent,
        UnverifyAccountComponent,
        VerifyAccountComponent,
        AddOtherOptionDialogComponent,
        ChoicesComponent,
        AddUserComponent,
        EditUserComponent,
        UserProfileComponent,
        OrderAcceptDialogComponent,
        ViewUsersComponent,
        EmailDialogComponent,
        RestaurantQrCodeComponent,
        CategoriesComponent,
        RestaurantContactDetailsComponent,
        AddContactDetailsComponent,
        RestaurantTablesComponent,
        AddTableComponent,
        PromocodeComponent,
        PromoCodeListComponent,
        AddPaymentComponent,
        verifiedComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        AngularMaterialModule,
    ],
})
export class AdminModule {}
