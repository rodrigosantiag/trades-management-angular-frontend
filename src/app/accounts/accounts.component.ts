import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {AccountService} from './shared/account.service';
import {Account} from './shared/account.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  public accounts: Array<Account>;
  public form: FormGroup;
  public formUtils: FormUtils;
  public messages: Array<string>;
  public submitted: boolean;


  public constructor(
    private formBuilder: FormBuilder,
    private flashMessages: FlashMessagesService,
    private accountService: AccountService) {
  }

  ngOnInit() {
  }

}
