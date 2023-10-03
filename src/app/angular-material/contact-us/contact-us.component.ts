import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomerService } from "src/app/api/customer.service";

@Component({
    selector: "app-contact-us",
    templateUrl: "./contact-us.component.html",
    styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent implements OnInit {
    emailForm: FormGroup;
    fb: any;
    constructor(
        private formBuilder: FormBuilder,
        private customerService: CustomerService
    ) {}

    ngOnInit(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        this.emailForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            subject: ["", Validators.required],
            message: ["", Validators.required],
        });
    }
    generateForm() {
        this.emailForm = this.fb.group({
            email: [
                "",
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern(
                        "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}"
                    ),
                ],
            ],
            password: [
                "",
                [
                    Validators.required,
                    Validators.pattern(
                        "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                    ),
                ],
            ],
        });
    }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.emailForm.get(fieldName).errors &&
            this.emailForm.get(fieldName).errors[errorString] &&
            (this.emailForm.get(fieldName).dirty ||
                this.emailForm.get(fieldName).touched)
        );
    }
    checkError(fieldName: string, errorString: string) {
        return (
            this.emailForm.get(fieldName).errors &&
            this.emailForm.get(fieldName).errors[errorString] &&
            (this.emailForm.get(fieldName).dirty ||
                this.emailForm.get(fieldName).touched)
        );
    }
    onSubmit() {
        this.emailForm.markAllAsTouched();
        if (this.emailForm.valid) {
            // Handle the form data here (e.g., sending the email)
            const formData = this.emailForm.value;
            this.customerService.sendEmail(formData).subscribe({
                next: (res) => {
                    this.emailForm.reset();
                },
            });
        }
    }
}
