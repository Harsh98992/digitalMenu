import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/api/authentication.service';
import { UtilService } from 'src/app/api/util.service';
import { ConfirmedValidator } from '../common/confirmed.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../common/auth.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  passwordFlag = true;
  confirmPasswordFlag = true;
  resetForm: FormGroup;
  resetPasswordToken = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getToken();
    this.generateForm();
  }
  getToken() {
    this.route.params.subscribe((params) => {
      this.resetPasswordToken = params['resetPasswordToken'];
    });
  }
  generateForm() {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
            ),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
            ),
          ],
        ],
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }
  checkForError(fieldName: string, errorString: string) {
    return (
      this.resetForm.get(fieldName).errors &&
      this.resetForm.get(fieldName).errors[errorString] &&
      (this.resetForm.get(fieldName).dirty ||
        this.resetForm.get(fieldName).touched)
    );
  }
  togglePassowrdHide(field) {
    this.passwordFlag = !this.passwordFlag;
    field.type = !this.passwordFlag ? 'text' : 'password';
  }
  toggleConfirmPassword(field) {
    this.confirmPasswordFlag = !this.confirmPasswordFlag;
    field.type = !this.confirmPasswordFlag ? 'text' : 'password';
  }
  submitForm() {
    this.resetForm.markAllAsTouched();
    if (this.resetForm.valid) {
      this.authService
        .resetPassword(
          this.resetForm.get('password').value,
          this.resetPasswordToken
        )
        .subscribe({
          next: (res: any) => {
            this.router.navigateByUrl('/admin/login');
          },
        });
    }
  }
}
