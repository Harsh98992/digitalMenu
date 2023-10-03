import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ConfirmDialogComponent } from "src/app/angular-material/confirm-dialog/confirm-dialog.component";
import { UserService } from "src/app/api/user.service";

@Component({
    selector: "app-view-user",
    templateUrl: "./view-user.component.html",
    styleUrls: ["./view-user.component.scss"],
})
export class ViewUserComponent implements OnInit {
    @ViewChild('myTable', { static: false }) table: DatatableComponent;
    rows = [];
    searchTerm = '';
    ColumnMode = ColumnMode;
    filteredData: any;
    columns = [
        { name: "Actions" },
        { name: "Name", prop: "name" },
        { name: "Email", prop: "email" },
        { name: "Phone Number", prop: "phoneNumber" },
        { name: "Role", prop: "role" },
    ];
    usersList: any;

    constructor(
        private userService: UserService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getUsers();
    }
    applyFilter(): void {
        const filterValue = this.searchTerm.toLowerCase();
    
        this.filteredData = this.usersList.filter((row) => {
          return Object.keys(row).some((key) =>
            String(row[key]).toLowerCase().includes(filterValue)
          );
        });
        this.table.offset = 0; // Reset pagination to the first page
      }
    getUsers() {
        this.userService.getAllUsers().subscribe({
            next: (res: any) => {
                console.log(res);
                this.rows = res.data.users;
                this.usersList=res.data.users
                console.log(res.data);
                console.log(this.rows);
            },
        });
    }

    editUser(user: any) {
        // Redirect to the edit user page with the user ID
        this.router.navigate(["/admin/user-managment/edit", user._id]);
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
