import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { CustomerAuthService } from "src/app/restaurant/api/customer-auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        public auth: AuthenticationService,
        private customerAuth: CustomerAuthService
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const token = this.customerAuth.getUserToken();

        request = request.clone({
            setHeaders: {
                Authorization: token
                    ? `Bearer ${token}`
                    : `Bearer ${this.auth.getUserToken()}`,
            },
        });
        return next.handle(request);
    }
}
