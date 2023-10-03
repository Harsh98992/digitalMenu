import {
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { AddExtraComponent } from "./add-extra/add-extra.component";
import { Subject, takeUntil } from "rxjs";
import { UtilService } from "src/app/api/util.service";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { AddAddOnDialogComponent } from "../add-add-on-dialog/add-add-on-dialog.component";

@Component({
    selector: "app-extras",
    templateUrl: "./extras.component.html",
    styleUrls: ["./extras.component.scss"],
})
export class ExtrasComponent implements OnInit, OnDestroy {
    @ViewChild("menu", { static: true }) menu: TemplateRef<any>;
    @ViewChild("myTable", { static: false }) table: DatatableComponent;
    rows = [];

    ColumnMode = ColumnMode;
    destroy$: Subject<boolean> = new Subject<boolean>();
    columns = [];
    extraIngredents = [];
    searchTerm = "";
    filteredData: any;
    constructor(
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.getRestaurantDetail();
        this.columns = [
            { name: "Actions", prop: "action" },
            { name: "Add On Group Name", prop: "addOnGroupName" },
            { name: "Min Value", prop: "addOnMinValue" },
            { name: "Max Value", prop: "addOnMaxValue" },
        ];
    }
    openAddOnDialog() {
        let dialogRef = this.dialog.open(AddAddOnDialogComponent, {
            disableClose: true,
            panelClass: "app-full-order-dialog",
            minWidth: "70%",
        });
    }
    deleteAddon(row: any) {
        const dialogData = {
            title: "Confirm",
            message: "Are you sure you want to delete this item?",
        };
        this.dialog
            .open(ConfirmDialogComponent, { data: dialogData })
            .afterClosed()
            .subscribe({
                next: (res: any) => {
                    if (res && res.okFlag) {
                        this.restaurantService.deleteAddons(row._id).subscribe({
                            next: (res) => {
                                this.restaurantService.setRestaurantData();
                                this.applyFilter();
                            },
                        });
                    }
                },
            });
    }
    editAddon(row) {
        let dialogRef = this.dialog.open(AddAddOnDialogComponent, {
            disableClose: true,
            panelClass: "app-full-order-dialog",
            minWidth: "70%",
            data: {
                ...row,
                editFlag: true,
            },
        });
    }
    getRestaurantDetail() {
        this.restaurantService.restaurantData
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    if (res && res.addOns) {
                        this.extraIngredents = res.addOns;
                        this.rows = res.addOns;
                        this.applyFilter();
                    }
                },
            });
    }
    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();

        this.filteredData = this.extraIngredents.filter((row) => {
            return Object.keys(row).some((key) =>
                String(row[key]).toLowerCase().includes(filterValue)
            );
        });
        if (this.table) {
            this.table.offset = 0; // Reset pagination to the first page
        }
    }
    addExtra() {
        let dialogRef = this.dialog.open(AddExtraComponent, {
            disableClose: true,
            panelClass: "app-full-bleed-dialog",
        });
    }
    editExtra(data) {
        data["editFlag"] = true;

        let dialogRef = this.dialog.open(AddExtraComponent, {
            disableClose: true,
            panelClass: "app-full-bleed-dialog",
            data: data,
        });
    }
    deleteExtra(data) {
        const dialogData = {
            title: "Confirm",
            message: "Are you sure you want to delete this item?",
        };
        this.dialog
            .open(ConfirmDialogComponent, { data: dialogData })
            .afterClosed()
            .subscribe({
                next: (res: any) => {
                    if (res && res.okFlag) {
                        this.restaurantService
                            .deleteExtraIngredient(data._id)
                            .subscribe({
                                next: (res: any) => {
                                    this.restaurantService.setRestaurantData(
                                        res
                                    );
                                },
                            });
                    }
                },
            });
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
