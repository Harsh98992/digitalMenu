import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { Subject, takeUntil } from "rxjs";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";

@Component({
    selector: "app-restaurant-contact-details",
    templateUrl: "./restaurant-contact-detail.component.html",
    styleUrls: ["./restaurant-contact-detail.component.scss"],
})
export class RestaurantContactDetailsComponent implements OnInit {
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    columns = [];

    ColumnMode = ColumnMode;
    rows = [];
    searchTerm = "";
    filteredData: any;
    destroy$: Subject<boolean> = new Subject<boolean>();
    constructor(
        private restaurantService: RestaurantPanelService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getRestaurantDetail();
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Contact Type", prop: "contactType" },
            { name: "Contact Detail", prop: "contactDetails" },
        ];
    }
    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();

        this.filteredData = this.rows.filter((row) => {
            return Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );
        });
        this.table.offset = 0; // Reset pagination to the first page
    }
    getRestaurantDetail() {
        this.restaurantService.restaurantData
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    if (res && res?.contact) {
                        this.rows = res.contact;
                    }
                },
            });
    }
    deleteContact(row) {
        this.restaurantService.deleteContactDetail(row._id).subscribe({
            next: (res: any) => {
                this.restaurantService.setRestaurantData(res?.data.message);
            },
        });
    }
    editContact(row) {
        console.log(row.contactDetails);
        
        this.router.navigate(
            [`/admin/restaurent-contact-details/edit/${row._id}`],
            {
                queryParams: {
                    contactType: row.contactType,
                    contactDetails: row.contactDetails,
                },
            }
        );
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
