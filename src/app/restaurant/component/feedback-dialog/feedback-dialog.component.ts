import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RestaurantService } from "../../api/restaurant.service";

@Component({
    selector: "app-feedback-dialog",
    templateUrl: "./feedback-dialog.component.html",
    styleUrls: ["./feedback-dialog.component.scss"],
})
export class FeedbackDialogComponent implements OnInit {
    feedbackForm: FormGroup;
    selectedEmoji: number = 0;
    isSubmitting: boolean = false;
    emojis = [
        { value: 1, icon: "😡", label: "Very Dissatisfied" },
        { value: 2, icon: "😕", label: "Dissatisfied" },
        { value: 3, icon: "😐", label: "Neutral" },
        { value: 4, icon: "🙂", label: "Satisfied" },
        { value: 5, icon: "😄", label: "Very Satisfied" },
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<FeedbackDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private restaurantService: RestaurantService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.feedbackForm = this.fb.group({
            feedbackText: ["", [Validators.maxLength(500)]],
        });

        // Validate that restaurant ID is provided
        if (!this.data || !this.data.restaurantId) {
            this.snackBar.open(
                "Error: Restaurant information is missing",
                "Close",
                {
                    duration: 3000,
                }
            );
            this.dialogRef.close();
        }
    }

    selectEmoji(value: number): void {
        this.selectedEmoji = value;
    }

    submitFeedback(): void {
        if (this.selectedEmoji === 0) {
            this.snackBar.open("Please select an emoji rating", "Close", {
                duration: 3000,
            });
            return;
        }

        if (!this.feedbackForm.valid) {
            this.snackBar.open(
                "Please correct the form errors before submitting",
                "Close",
                {
                    duration: 3000,
                }
            );
            return;
        }

        // Form is valid, proceed with submission
        this.isSubmitting = true;

        // Get user info if available
        const userInfo = localStorage.getItem("userData");
        let customerInfo = {};

        if (userInfo) {
            try {
                const userData = JSON.parse(userInfo);
                if (userData) {
                    customerInfo = {
                        customerId: userData._id,
                        name: userData.name,
                        email: userData.email,
                    };
                }
            } catch (e) {
                console.error("Error parsing user data:", e);
            }
        }

        const feedbackData = {
            restaurantId: this.data.restaurantId,
            emoji: this.selectedEmoji,
            feedbackText: this.feedbackForm.value.feedbackText,
            customerInfo: customerInfo,
        };

        this.restaurantService.submitFeedback(feedbackData).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.snackBar.open("Thank you for your feedback!", "Close", {
                    duration: 3000,
                });
                this.dialogRef.close(true);
            },
            error: (error) => {
                this.isSubmitting = false;
                this.snackBar.open(
                    "Failed to submit feedback. Please try again.",
                    "Close",
                    {
                        duration: 3000,
                    }
                );
            },
        });
    }

    // Method to close the dialog
    cancel(): void {
        this.dialogRef.close();
    }
}
