import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../shared/auth.service';
import {FormUtils} from '../shared/form.utils';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public form: FormGroup;
  public submitted: boolean;
  public formUtils: FormUtils;
  public formErrors: Array<string>;

  constructor(private auth: AuthService, private formBuilder: FormBuilder) {
    this.setUpForm();
    this.submitted = false;
    this.formUtils = new FormUtils(this.form);
    this.submitted = false;
    this.formErrors = null;
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
          alert('Logou!');
          this.formErrors = null;
        },
        (error) => {
          if (error.status === 401) {
            this.formErrors = error.error.errors;
          } else {
            this.formErrors = ['An error ocurred. Please try again later.'];
          }
          this.submitted = false;
        }
      );
  }

  ngOnInit() {
  }

}
