import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/api/authentication.service';
import { UtilService } from 'src/app/api/util.service';
import { ConfirmedValidator } from '../common/confirmed.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../common/auth.component.scss'],
})
export class RegisterComponent implements OnInit {
  passwordFlag = true;
  confirmPasswordFlag = true;
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateForm();
  }
  generateForm() {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],

        phoneNumber: ['', [Validators.required,Validators.maxLength]],
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
  submitForm() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      const data = {
        name: this.registerForm.get('name').value,
        email: this.registerForm.get('email').value,
        phoneNumber: this.registerForm.get('phoneNumber').value,
        password: this.registerForm.get('password').value,
      };

      this.authService.register(data).subscribe({
        next: (res: any) => {
          this.authService.setUserToken(res.data.token);
          this.authService.setUserDetail(res.data.user);
          this.router.navigateByUrl('/admin/login');
        },
      });
    }
  }
  checkForError(fieldName: string, errorString: string) {
    return (
      this.registerForm.get(fieldName).errors &&
      this.registerForm.get(fieldName).errors[errorString] &&
      (this.registerForm.get(fieldName).dirty ||
        this.registerForm.get(fieldName).touched)
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
}
