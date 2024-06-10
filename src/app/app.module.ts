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
@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        UserLoginComponent,
        PositiveNumberDirective,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        ReactiveFormsModule, // Add ReactiveFormsModule
        NgbTimepickerModule, // Add NgbTimepickerModule
        ThermalPrintModule ,

        FormsModule,
        ReactiveFormsModule,

        NgxSpinnerModule.forRoot({ type: "square-jelly-box" }),
        ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: "registerWhenStable:30000",
        }),
    ],
    providers: [
        RestaurantAuthGuard,
        DatePipe,
        // {
        //     provide: "SocialAuthServiceConfig",
        //     useValue: {
        //         autoLogin: false,
        //         providers: [
        //             // {
        //             //     id: GoogleLoginProvider.PROVIDER_ID,
        //             //     provider: new GoogleLoginProvider(
        //             //         "503347741402-6md4jq747sncq0i21goufb0uc39m351k.apps.googleusercontent.com"
        //             //     ),
        //             // },
        //         ],
        //     } as SocialAuthServiceConfig,
        // },
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
        BnNgIdleService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
