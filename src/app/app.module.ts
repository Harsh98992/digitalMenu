import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "./angular-material/angular-material.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./auth/register/register.component";
import { LoginComponent } from "./auth/login/login.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { RestaurantAuthGuard } from "./api/guard/restaurant-auth.guard";
import { TokenInterceptor } from "./api/interceptor/token.interceptor";
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingInterceptor } from "./api/interceptor/loading.interceptor";

import { UserLoginComponent } from "./user-auth/user-login/user-login.component";
import { PositiveNumberDirective } from "./api/positive-number.directive";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";

import { DatePipe } from "@angular/common";
import { BnNgIdleService } from "bn-ng-idle";
import { ThermalPrintModule } from "ng-thermal-print";
import { AcceptOrderBypassAuthComponent } from "./accept-order-bypass-auth/accept-order-bypass-auth.component";
import { UserBehaviorService } from "./services/user-behavior.service";
import { ReinforcementLearningNotificationService } from "./services/reinforcement-learning-notification.service";
import { SmartNotificationService } from "./services/smart-notification.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        UserLoginComponent,
        PositiveNumberDirective,
        AcceptOrderBypassAuthComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        MatSnackBarModule,
        HttpClientModule,
        NgbTimepickerModule, // Add NgbTimepickerModule
        ThermalPrintModule,

        FormsModule,
        ReactiveFormsModule,

        NgxSpinnerModule.forRoot({ type: "square-jelly-box" }),
  
    ],
    providers: [
        RestaurantAuthGuard,
        DatePipe,

        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true,
        },
        BnNgIdleService,
        UserBehaviorService,
        ReinforcementLearningNotificationService,
        SmartNotificationService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
