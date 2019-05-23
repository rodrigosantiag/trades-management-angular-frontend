import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {FormUtils} from '../shared/form.utils';

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

  constructor(private formBuilder: FormBuilder) {
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
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: [null, Validators.required]
    },
      {
        validators: this.passwordConfimationValidation
      });
  }

  ngOnInit() {
  }

}
