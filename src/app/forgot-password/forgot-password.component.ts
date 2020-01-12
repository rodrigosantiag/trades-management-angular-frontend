import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {FlashMessagesService} from '../shared/flashMessages.service';

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

  constructor(private formBuilder: FormBuilder, private flashMessage: FlashMessagesService) {
    this.setUpForm();
    this.formUtils = new FormUtils(this.form);
    this.submitted = false;
    this.messages = null;
  }

  ngOnInit() {
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      login: [null, [Validators.required, Validators.email]]
    });
  }

}
