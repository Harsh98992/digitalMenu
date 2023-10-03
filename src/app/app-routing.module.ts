import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RestaurantAuthGuard } from './api/guard/restaurant-auth.guard';
import { NotFoundComponent } from './angular-material/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./restaurant/restaurant.module').then((m) => m.RestaurantModule),
  },
  {
    path: 'admin/register',
    component: RegisterComponent,
  },
  {
    path: 'admin/login',
    component: LoginComponent,
  },
  {
    path: 'admin/forgotPassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'admin/resetPassword/:resetPasswordToken',
    component: ResetPasswordComponent,
  },
  {
    path: 'admin',
    // canLoad:[RestaurantAuthGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'notFound',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
