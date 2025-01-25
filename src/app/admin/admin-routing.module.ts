import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { DashboardComponent } from "./panel/dashboard/dashboard.component";
import { PromocodeComponent } from "./panel/promocode/promocode.component";
import { RestaurantProfileComponent } from "./panel/restaurant-profile/restaurant-profile.component";
import { RestaurantGalleryComponent } from "./panel/restaurant-gallery/restaurant-gallery.component";
import { RestaurantOrderComponent } from "./panel/restaurant-order/restaurant-order.component";
import { ViewUserComponent } from "./panel/user-managment/view-user/view-user.component";
import { AddUserComponent } from "./panel/user-managment/add-user/add-user.component";
import { RestaurantOrderViewComponent } from "./panel/restaurant-order/restaurant-order-view/restaurant-order-view.component";
import { CustomersComponent } from "./panel/customers/customers.component";
import { CouponComponent } from "./panel/marketing/coupon/coupon.component";
import { ReviewComponent } from "./panel/review/review.component";
import { StoreComponent } from "./panel/settings/store/store.component";
import { ResetPasswordComponent } from "./panel/profile/reset-password/reset-password.component";
import { OrderAcceptComponent } from "./layout/order/order-accept/order-accept.component";
import { ExtrasComponent } from "./panel/dishes/extras/extras.component";
import { AddDishComponent } from "./panel/dishes/add-dish/add-dish.component";
import { ViewDishComponent } from "./panel/dishes/view-dish/view-dish.component";
import { VerifiedAccountGuard } from "../api/guard/verified-account.guard";
import { VerifiedAccountChildGuard } from "../api/guard/verified-account-child.guard";
import { UnverifyAccountComponent } from "./panel/unverify-account/unverify-account.component";
import { VerifyAccountComponent } from "./panel/unverify-account/verify-account/verify-account.component";
import { ViewUsersComponent } from "./panel/unverify-account/view-users/view-users.component";
import { ChoicesComponent } from "./panel/dishes/choices/choices.component";
import { EditUserComponent } from "./panel/user-managment/edit-user/edit-user.component";
import { UserProfileComponent } from "./panel/user-profile/user-profile.component";
import { RestaurantQrCodeComponent } from "./panel/restaurant-qr-code/restaurant-qr-code.component";
import { CategoriesComponent } from "./panel/dishes/categories/categories.component";
import { RestaurantContactDetailsComponent } from "./panel/restaurant-contact-details/restaurant-contact-detail.component";
import { AddContactDetailsComponent } from "./panel/restaurant-contact-details/add-contact/add-contact-detail/add-contact-detail.component";
import { RestaurantTablesComponent } from "./panel/restaurant-tables/restaurant-tables.component";
import { PromoCodeListComponent } from "./panel/promo-code-list/promo-code-list.component";
import { RestaurntOwnerGuard } from "../api/guard/restaurnt-owner.guard";
import { verifiedComponent } from "./panel/unverify-account/verified/verified.component";
import { RestaurantRoomComponent } from "./panel/restaurant-room/restaurant-room.component";
import { RestaurantPaymentComponent } from "./panel/restaurant-payment/restaurant-payment.component";
const routes: Routes = [
    {
        path: "",
        component: LayoutComponent,
        children: [
            {
                path: "",
                component: DashboardComponent,
                canActivate: [VerifiedAccountGuard],
            },
            {
                path: "restaurent-contact-details",
                canActivateChild: [
                    VerifiedAccountChildGuard,
                    RestaurntOwnerGuard,
                ],
                children: [
                    {
                        path: "view",
                        component: RestaurantContactDetailsComponent,
                    },
                    {
                        path: "add",
                        component: AddContactDetailsComponent,
                    },
                    {
                        path: "edit/:id",
                        component: AddContactDetailsComponent,
                    },
                ],
            },
            {
                path: "restaurant-tables",
                canActivateChild: [
                    VerifiedAccountChildGuard,
                    RestaurntOwnerGuard,
                ],
                children: [
                    {
                        path: "view",
                        component: RestaurantTablesComponent,
                    },
                    {
                        path: "add",
                        component: AddContactDetailsComponent,
                    },
                    {
                        path: "edit/:id",
                        component: EditUserComponent,
                    },
                ],
            },
            {
                path: "restaurant-room",
                canActivateChild: [
                    VerifiedAccountChildGuard,
                    RestaurntOwnerGuard,
                ],
                children: [
                    {
                        path: "view",
                        component: RestaurantRoomComponent,
                    },
                ],
            },
            {
                path: "restaurant-profile",
                component: RestaurantProfileComponent,
                canActivate: [RestaurntOwnerGuard],
            },
            {
                path: "unVerifyRequest",
                component: UnverifyAccountComponent,
            },
            {
                path: "VerifiedAccount",
                component: verifiedComponent,
            },
            {
                path: "verifyAccount/:id",
                component: VerifyAccountComponent,
            },

            {
                path: "view-users/:id",
                component: ViewUsersComponent,
            },
            {
                path: "customers",
                component: CustomersComponent,
                canActivate: [VerifiedAccountGuard, RestaurntOwnerGuard],
            },
            {
                path: "restaurantQrCode",
                component: RestaurantQrCodeComponent,
                canActivate: [VerifiedAccountGuard],
            },
            {
                path: "restaurant-images",
                component: RestaurantGalleryComponent,
                canActivate: [VerifiedAccountGuard, RestaurntOwnerGuard],
            },
            {
                path: "review",
                component: ReviewComponent,
                canActivate: [VerifiedAccountGuard],
            },

            {
                path: "marketing",
                canActivateChild: [VerifiedAccountChildGuard],
                children: [
                    {
                        path: "coupon",
                        component: CouponComponent,
                    },
                ],
            },
            {
                path: "dishes",
                canActivateChild: [
                    VerifiedAccountChildGuard,
                    RestaurntOwnerGuard,
                ],
                children: [
                    {
                        path: "extras",
                        component: ExtrasComponent,
                    },
                    {
                        path: "choices",
                        component: ChoicesComponent,
                    },
                    {
                        path: "add-dish",
                        component: AddDishComponent,
                    },
                    {
                        path: "view-dish",
                        component: ViewDishComponent,
                    },
                    {
                        path: "view-category",
                        component: CategoriesComponent,
                    },
                ],
            },
            {
                path: "restaurant-orders",
                canActivateChild: [VerifiedAccountChildGuard],
                children: [
                    {
                        path: "",
                        component: RestaurantOrderComponent,
                    },
                    {
                        path: "view",
                        component: RestaurantOrderViewComponent,
                    },
                    {
                        path: "accept",
                        component: OrderAcceptComponent,
                    },
                ],
            },
            {
                path: "user-profile",
                component: UserProfileComponent,
            },
            {
                path: "payment",
                component: RestaurantPaymentComponent,
                canActivateChild: [
                    VerifiedAccountChildGuard,
                    RestaurntOwnerGuard,
                ],
            },
            {
                path: "user-managment",
                canActivateChild: [
                    VerifiedAccountChildGuard,
                    RestaurntOwnerGuard,
                ],
                children: [
                    {
                        path: "view",
                        component: ViewUserComponent,
                    },
                    {
                        path: "add",
                        component: AddUserComponent,
                    },
                    {
                        path: "edit/:id",
                        component: EditUserComponent,
                    },
                ],
            },
            {
                path: "setting",
                canActivateChild: [
                    VerifiedAccountChildGuard,
                    RestaurntOwnerGuard,
                ],
                children: [
                    {
                        path: "store",
                        component: StoreComponent,
                    },
                ],
            },
            {
                path: "profile",
                canActivateChild: [VerifiedAccountChildGuard],
                children: [
                    {
                        path: "resetPassword",
                        component: ResetPasswordComponent,
                    },
                ],
            },
            {
                path: "promocode",
                canActivateChild: [
                    VerifiedAccountChildGuard,
                    RestaurntOwnerGuard,
                ],
                children: [
                    {
                        path: "add",
                        component: PromocodeComponent,
                    },
                    {
                        path: "view",
                        component: PromoCodeListComponent,
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
