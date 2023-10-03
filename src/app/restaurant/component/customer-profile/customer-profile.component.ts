import { Component, OnInit } from "@angular/core";
import { CustomerService } from "src/app/api/customer.service";
import { CustomerAuthService } from "../../api/customer-auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-customer-profile",
    templateUrl: "./customer-profile.component.html",
    styleUrls: ["./customer-profile.component.scss"],
})
export class CustomerProfileComponent implements OnInit {
    userDetail = null;
    userPageFlag = true;
    customerForm: FormGroup;
    constructor(
        private customerAuthService: CustomerAuthService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getQueryParams();
        this.initForm();
    }
    getQueryParams() {
        this.route.queryParams.subscribe((queryParams) => {
            // Use queryParams to access the values
            const key = queryParams["page"];
            if (key === "profile") {
                this.userPageFlag = true;
            } else {
                this.userPageFlag = false;
            }
        });
    }
    updateUserPageFlag(flag: boolean) {
        this.userPageFlag = flag;
        if (flag) {
            this.router.navigate(["/customer-profile"], {
                queryParams: { page: "profile" },
            });
        } else {
            this.router.navigate(["/customer-profile"], {
                queryParams: { page: "address" },
            });
        }
      
    }
    initForm(): void {
        // Use FormBuilder to create the form with validation rules
        this.customerForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
            name: ["", [Validators.required]],
            phoneNumber: [
                "",
                [Validators.required, Validators.pattern("^[0-9]{10}$")],
            ],
        });
        this.customerForm.disable();
        this.getCustomerDetails();
    }
    enableForm() {
        this.customerForm.enable();
    }
    onSubmit(): void {
        console.log(this.customerForm.value);
        if (this.customerForm.valid) {
            // Handle form submission here (e.g., send the data to a server)
        } else {
            // Form is invalid, show some error message or perform appropriate action
        }
    }
    getCustomerDetails() {
        this.customerAuthService.customerDetail.subscribe({
            next: (res) => {
                if (res) {
                    this.customerForm.patchValue(res);
                    this.userDetail = res;
                }
            },
        });
    }
}
