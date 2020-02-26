import {Component, OnInit} from '@angular/core';
import {User} from '../shared/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {UserService} from './shared/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HelpersFunctionsService} from '../shared/helpers.functions.service';

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
    private helpers: HelpersFunctionsService
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
    //  TODO: update user function
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      risk: [null, [Validators.required]]
    });
  }

}
