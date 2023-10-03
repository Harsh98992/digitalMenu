import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgxScannerQrcodeComponent } from "ngx-scanner-qrcode";

@Component({
    selector: "app-qr-code-scanner",
    templateUrl: "./qr-code-scanner.component.html",
    styleUrls: ["./qr-code-scanner.component.scss"],
})
export class QrCodeScannerComponent implements OnInit {
    @ViewChild("action") action: NgxScannerQrcodeComponent;
    constructor(private router: Router) {}

    funLogin(url) {
        this.router.navigateByUrl(url);
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.action.start();

        this.action.data.subscribe((res: any) => {
            if (res && res.data) {
                const url = res.data;

                window.location.href = url;

                this.action.stop();
            } else {
            }
        });
    }

    test() {}
    public onEvent(e: any[], action?: any): void {
        // e && action && action.pause();
        console.log(e);
    }
    ngOnDestroy() {
        this.action.stop();
    }
}
