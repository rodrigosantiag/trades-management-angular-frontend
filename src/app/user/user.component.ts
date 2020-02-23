import {Component, OnInit} from '@angular/core';
import {User} from '../shared/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {UserService} from './shared/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  pubic;
  email: string;
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
    private router: Router
  ) {

    this.userService.getUser(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
      (user: User) => {
        console.log(user);
        this.email = user.email;
        this.user = user;
        this.setUpForm();
      //  TODO: setup form on view
      },
      error => {
        alert('An error ocurred. Please try again later.');
        this.router.navigate(['/']);
      }
    );

  }

  ngOnInit() {
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      risk: [this.user.risk, Validators.required]
    });
  }

}
