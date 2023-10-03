import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from "@angular/common/http";
import { Observable, catchError, finalize, tap, throwError } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { UtilService } from "../util.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    constructor(
        private loader: NgxSpinnerService,
        private utilService: UtilService
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const loadingHiddenApi = [
            "/api/v1/restaurant/reviews",
            "/api/v1/orders/getCustomerPaymentPendingOrder",
            "/api/v1/customer/getAllRestaurants",
            // "/api/v1/customer/isDineInAvailable",
        ];
        for (const api of loadingHiddenApi) {
            if (request.url.includes(api)) {
                return next.handle(request);
            }
        }


        this.totalRequests++;
        this.loader.show();
        return next.handle(request).pipe(
            catchError((err) => {
                console.log(err.error);

                if (err && err.error && err.error.message) {
                    this.utilService.openSnackBar(
                        err.error.message,
                        true,
                        5000
                    );
                } else {
                    this.utilService.openSnackBar(
                        "Something went wrong!",
                        true,
                        5000
                    );
                }
                return throwError(err);
            }),
            tap((res: any) => {
                if (res.body && res.body.data && res.body.data.message) {
                    this.utilService.openSnackBar(
                        res.body.data.message,
                        false,
                        5000
                    );
                }
            }),
            finalize(() => {
                this.totalRequests--;
                if (this.totalRequests == 0) {
                    this.loader.hide();
                }
            })
        );
    }
}
