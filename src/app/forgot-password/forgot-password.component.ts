import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public form: FormGroup;
  public submitted: boolean;
  public formUtils: FormUtils;
  public messages: Array<string>;

  constructor(private formBuilder: FormBuilder, private flashMessage: FlashMessagesService, private authService: AuthService) {
    this.setUpForm();
    this.formUtils = new FormUtils(this.form);
    this.submitted = false;
    this.messages = null;
  }

  public forgotPassword() {
    this.submitted = true;
    this.authService.forgotPassWord(this.form.get('login').value)
      .subscribe(
        () => {
          this.messages = ['Success! Check your email for instructions'];
          this.form.reset();
          this.submitted = false;
          this.flashMessage.buildFlashMessage(this.messages, false, false, 'success');
        },
        (error) => {
          this.messages = error.error.errors;
          this.submitted = false;
          this.flashMessage.buildFlashMessage(this.messages, false, false, 'danger');
        }
      );
  }

  ngOnInit() {
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      login: [null, [Validators.required, Validators.email]]
    });
  }

}
