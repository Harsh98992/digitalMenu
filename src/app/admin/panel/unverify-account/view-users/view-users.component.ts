import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { UserService } from "src/app/api/user.service";
import { AdminPanelService } from "src/app/api/admin-panel.service";

@Component({
    selector: "app-view-users",
    templateUrl: "./view-users.component.html",
    styleUrls: ["./view-users.component.scss"],
})
export class ViewUsersComponent implements OnInit {
    rows = [];
    ColumnMode = ColumnMode;

    // restaurantId: get the restaurant id from the url as url is like view-users/restaurantId

    columns = [
        { name: "Actions" },
        { name: "Name", prop: "name" },
        { name: "Email", prop: "email" },
        { name: "Phone Number", prop: "phoneNumber" },
        { name: "Role", prop: "role" },
    ];

    constructor(
        private userService: UserService,
        private router: Router,
        public dialog: MatDialog,
        private adminPanelService: AdminPanelService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.getUsers();
    }

    getUsers() {
        this.route.params.subscribe((params) => {
            const id = params["id"]; // Assuming the parameter name is 'id'
            this.adminPanelService.viewAllUsersOfRestaurant(id).subscribe({
                next: (res: any) => {
                    console.log("this is the response" + res);
                    this.rows = res.data.userDetails;
                    console.log("this is the rows " + this.rows);
                    console.log(this.rows);
                },
            });
        });
    }

    deleteUser(user: any) {
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
                        this.userService.deleteUser(user._id).subscribe({
                            next: (res) => {
                                this.getUsers();
                            },
                        });
                    }
                },
            });
    }
}
