import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

import {AuthService} from '../shared/auth.service';
import {FormUtils} from '../shared/form.utils';
import {User} from '../shared/user.model';
import {FlashMessagesService} from 'angular2-flash-messages';


@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  public form: UntypedFormGroup;
  public formUtils: FormUtils;
  public submitted: boolean;
  public messages: Array<string>;

  constructor(private formBuilder: UntypedFormBuilder, private authService: AuthService, private flashMessage: FlashMessagesService) {
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

  private setUpForm() {
    this.form = this.formBuilder.group({
        login: [null, [Validators.required, Validators.email]],
        name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        passwordConfirmation: [null, [Validators.required]],
        risk: [null, Validators.required]
      },
      {
        validators: this.passwordConfimationValidation
      });
  }

  public sigUpUser() {
    this.submitted = true;
    this.authService.signUp(this.form.value as User)
      .subscribe(
        () => {
          this.messages = ['Check your email to confirm your account'];
          this.form.reset();
          this.submitted = false;
          this.flashMessage.show(this.messages.join(' | '), {
              cssClass: 'alert-success',
              timeout: 5000
            });
        },
        (error) => {
          if (error.status === 422) {
            this.messages = error.error.errors.full_messages;
          } else {
            this.messages = ['An error ocurred. Please try again later.'];
          }
          this.submitted = false;
          this.flashMessage.show(this.messages.join(' | '), {
              cssClass: 'alert-danger',
              timeout: 5000
            });
        }
      );
    window.scrollTo(0, 0);
  }

  ngOnInit() {
  }

}
