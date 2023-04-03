import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {AuthService} from '../shared/auth.service';
import {ResetPasswordService} from './shared/reset-password.service';
import {ResetPasswordModel} from './shared/reset-password.model';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordToken: string;
  public form: UntypedFormGroup;
  public submitted: boolean;
  public formUtils: FormUtils;
  public messages: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private resetPasswordService: ResetPasswordService) {
    this.resetPasswordToken = this.route.snapshot.paramMap.get('reset_password_token');
    this.setUpForm();
    this.formUtils = new FormUtils(this.form);
    this.submitted = false;
    this.messages = null;
  }

  public passwordConfimationValidation(form: UntypedFormGroup) {
    if (form.get('password').valid && form.get('password').value === form.get('passwordConfirmation').value) {
      form.get('passwordConfirmation').setErrors(null);
    } else {
      form.get('passwordConfirmation').setErrors({mismatch: true});
    }
  }

  public resetPassword() {
    this.submitted = true;
    const resetPassword = new ResetPasswordModel(
      this.form.get('password').value,
      this.form.get('passwordConfirmation').value,
      this.form.get('resetPasswordToken').value
    );

    this.resetPasswordService.resetPassword(resetPassword)
      .subscribe(
        () => {
          this.messages = [`Password updated! Now you can <a href="sign-in">login</a> using your new password`];
          this.submitted = false;
          this.form.reset();
          this.flashMessage.show(this.messages.join(' | '), {
            cssClass: 'alert-success',
            timeout: 5000
          });
        },
        (error) => {
          this.messages = error.error.errors;
          this.submitted = false;
          this.flashMessage.show(this.messages.join(' | '), {
            cssClass: 'alert-danger',
            timeout: 5000
          });
        }
      );
  }

  ngOnInit() {
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
        password: [null, [Validators.required, Validators.minLength(8)]],
        passwordConfirmation: [null, [Validators.required]],
        resetPasswordToken: [this.resetPasswordToken]
      },
      {
        validators: this.passwordConfimationValidation
      });
  }

}
