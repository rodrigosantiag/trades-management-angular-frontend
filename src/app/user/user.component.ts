import {Component, OnInit} from '@angular/core';
import {User} from '../shared/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {UserService} from './shared/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HelpersFunctionsService} from '../shared/helpers.functions.service';
import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public email: string;
  public user: User;
  public form: FormGroup;
  public formUtils: FormUtils;
  public messages: Array<string>;
  public submitted: boolean;

  constructor(
    private flashMessages: FlashMessagesService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private helpers: HelpersFunctionsService,
    private authService: AuthService
  ) {
    this.setUpForm();
    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.userService.getUser(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
      (user: User) => {
        this.email = user.email;
        this.user = user;
        this.form.patchValue(this.user);
      },
      error => {
        alert('An error ocurred. Please try again later.');
        this.router.navigate(['/']);
      }
    );
  }

  public updateUser() {
    this.submitted = true;
    this.user.name = this.form.get('name').value;
    this.user.risk = this.form.get('risk').value;

    return this.userService.update(this.user)
      .subscribe(
        (response) => {
          this.messages = [`User ${response.name}'s profile updated!`];
          this.flashMessages.buildFlashMessage(this.messages, 5000, true, 'success');
          this.authService.setUserName(response.name);
          this.submitted = false;
        },
        (response) => {
          this.messages = response.errors.full_messages;
          this.flashMessages.buildFlashMessage(this.messages, 0, true, 'danger');
          this.submitted = false;
        }
      );
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      risk: [null, [Validators.required]]
    });
  }

}
