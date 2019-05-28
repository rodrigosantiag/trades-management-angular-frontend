import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../shared/auth.service';
import {FormUtils} from '../shared/form.utils';
import {Router} from '@angular/router';
import {NgFlashMessageService} from 'ng-flash-messages';
import {FlashMessagesService} from '../shared/flashMessages.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public form: FormGroup;
  public submitted: boolean;
  public formUtils: FormUtils;
  public messages: Array<string>;

  public constructor(private auth: AuthService,
                     private formBuilder: FormBuilder,
                     private router: Router,
                     private flashMessage: FlashMessagesService) {
    this.setUpForm();
    this.submitted = false;
    this.formUtils = new FormUtils(this.form);
    this.submitted = false;
    this.messages = null;
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      login: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  public signInUser() {
    this.submitted = true;
    this.auth.signIn(this.form.get('login').value, this.form.get('password').value)
      .subscribe(
        () => {
          this.router.navigate(['/brokers']);
          this.messages = null;
        },
        (error) => {
          if (error.status === 401) {
            this.messages = error.error.errors;
          } else {
            this.messages = ['An error ocurred. Please try again later.'];
          }
          this.submitted = false;
          this.flashMessage.buildFlashMessage(this.messages, false, false, 'danger');
        }
      );
  }

  ngOnInit() {
  }

}
