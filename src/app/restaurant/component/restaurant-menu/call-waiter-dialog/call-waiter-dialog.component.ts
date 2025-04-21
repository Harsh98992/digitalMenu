import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UtilService } from "src/app/api/util.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

@Component({
    selector: "app-call-waiter-dialog",
    templateUrl: "./call-waiter-dialog.component.html",
    styleUrls: ["./call-waiter-dialog.component.scss"],
})
export class CallWaiterDialogComponent implements OnInit {
    waiterForm: FormGroup;
    restaurantData: any;
    tableData: any = [];
    isLoading = false;
    successMessage = "";
    errorMessage = "";

    constructor(
        private fb: FormBuilder,
        private restaurantService: RestaurantService,
        private utilService: UtilService,
        public dialogRef: MatDialogRef<CallWaiterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.restaurantData = this.data.restaurantData;
        this.tableData = this.data.tableData || [];

        this.initForm();
    }

    initForm(): void {
        this.waiterForm = this.fb.group({
            name: ["", [Validators.required]],
            tableId: ["", [Validators.required]],
            message: [""],
        });
    }

    onSubmit(): void {
        if (this.waiterForm.invalid) {
            this.waiterForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.successMessage = "";
        this.errorMessage = "";

        const formData = this.waiterForm.value;
        // Ensure we're sending the correct parameter names
        const requestData = {
            restaurantId: this.restaurantData._id,
            name: formData.name, // This is the parameter name expected by the backend
            customerName: formData.name, // Send both name and customerName to be safe
            tableId: formData.tableId,
            message: formData.message || "",
        };

        // Validate the data before sending
        if (!requestData.restaurantId) {
            console.error("Missing restaurantId");
            this.errorMessage = "Restaurant ID is missing. Please try again.";
            this.isLoading = false;
            return;
        }

        if (!requestData.tableId) {
            console.error("Missing tableId");
            this.errorMessage = "Please select a table.";
            this.isLoading = false;
            return;
        }

        // Log the request data for debugging
        console.log("Request data to be sent:", JSON.stringify(requestData));

        console.log("Submitting waiter call request:", requestData);

        this.restaurantService.callWaiter(requestData).subscribe({
            next: (response: any) => {
                console.log("Waiter call response:", response);
                this.isLoading = false;
                this.successMessage = "Waiter has been called successfully!";

                // Show a notification
                this.utilService.openSnackBar(
                    "Waiter has been called successfully!",
                    false
                );

                // Log the waiter call data for debugging
                console.log("Waiter call data sent to server:", requestData);
                console.log("Waiter call response from server:", response);

                // Close dialog after showing success message
                setTimeout(() => {
                    this.dialogRef.close({ success: true });
                }, 2000);
            },
            error: (error) => {
                console.error("Error calling waiter:", error);
                this.isLoading = false;

                // Extract the error message
                let errorMsg = "Failed to call waiter. Please try again.";
                if (error.error && error.error.message) {
                    errorMsg = error.error.message;
                } else if (error.message) {
                    errorMsg = error.message;
                }

                this.errorMessage = errorMsg;
                console.error("Detailed error:", JSON.stringify(error));

                // Show error notification
                this.utilService.openSnackBar(this.errorMessage, true);
            },
        });
    }

    // Helper method to check for form errors
    hasError(controlName: string, errorName: string): boolean {
        const control = this.waiterForm.get(controlName);
        return control && control.touched && control.hasError(errorName);
    }
}
