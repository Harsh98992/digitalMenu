import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { AdminPanelService } from "src/app/api/admin-panel.service";

@Component({
    selector: "app-unverify-account",
    templateUrl: "./unverify-account.component.html",
    styleUrls: ["./unverify-account.component.scss"],
})
export class UnverifyAccountComponent implements OnInit {
    @ViewChild("editTmpl", { static: true }) editTmpl: TemplateRef<any>;
    rows = [];
    columns = [];
    ColumnMode = ColumnMode;
    selectedOption = false;
    constructor(private adminService: AdminPanelService) {}

    ngOnInit(): void {
        this.getUnVerifiedAccount();

        // this.generateTable();
    }

    // restaurantName,restaurantPhoneNumber,gstNumberfssaiLicenseNumber,restaurantEmail

    getUnVerifiedAccount() {
        // use the getRestaurantsByStatus() method from the AdminPanelService
        this.adminService
            .getRestaurantsByStatus(this.selectedOption)
            .subscribe({
                next: (res: any) => {
                    this.rows = res.data.restaurantDetail;
                },
            });
    }
}
