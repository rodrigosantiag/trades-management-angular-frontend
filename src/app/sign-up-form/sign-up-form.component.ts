import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../shared/auth.service';
import {FormUtils} from '../shared/form.utils';
import {UserModel} from '../shared/user.model';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  public form: FormGroup;
  public formUtils: FormUtils;
  public submitted: boolean;
  public formErrors: Array<string>;
  public successMessage: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.setUpForm();
    this.formUtils = new FormUtils(this.form);
    this.submitted = false;
    this.formErrors = null;
  }

  public passwordConfimationValidation(form: FormGroup) {
    if (form.get('password').valid && form.get('password').value === form.get('passwordConfirmation').value) {
      form.get('passwordConfirmation').setErrors(null);
    } else {
      form.get('passwordConfirmation').setErrors({mismatch: true});
    }
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
        login: [null, [Validators.required, Validators.email]],
        name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        passwordConfirmation: [null, [Validators.required]],
        risk: [null]
      },
      {
        validators: this.passwordConfimationValidation
      });
  }

  public sigUpUser() {

    this.successMessage = null;
    this.submitted = true;
    this.authService.signUp(this.form.value as UserModel)
      .subscribe(
        () => {
          this.successMessage = 'Check your email to confirm your account';
          this.formErrors = null;
          this.form.reset();
          this.submitted = false;
        },
        (error) => {
          if (error.status === 422) {
            this.formErrors = error.error.errors.full_messages;
          } else {
            this.formErrors = ['An error ocurred. Please try again later.'];
          }
          this.successMessage = null;
          this.submitted = false;
        }
      );
  }

  ngOnInit() {
  }

}
