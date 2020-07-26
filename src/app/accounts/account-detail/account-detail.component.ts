import {Component, OnInit} from '@angular/core';
import * as currencies from 'currency-codes';
import {Broker} from '../../brokers/shared/broker.model';
import {BrokerService} from '../../brokers/shared/broker.service';
import {Account} from '../shared/account.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../../shared/form.utils';

import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AccountService} from '../shared/account.service';
import {Location} from '@angular/common';
import {switchMap} from 'rxjs/operators';
import {HelpersFunctionsService} from '../../shared/helpers.functions.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  public account: Account;
  public currencies: any;
  public brokers: Array<Broker>;
  public newAccount: Account;
  public form: FormGroup;
  public formUtils: FormUtils;
  public messages: Array<string>;
  public submitted: boolean;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private brokerService: BrokerService,
    private flashMessages: FlashMessagesService,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    public helpers: HelpersFunctionsService) {
    this.brokerService.getAll()
      .subscribe(
        brokers => this.brokers = brokers
      );

    this.currencies = currencies.codes().map((currency) => {
      return currencies.code(currency);
    });

    this.newAccount = new Account(
      null,
      '',
      '',
      0,
      0,
      null
    );

    this.setUpForm();

    this.formUtils = new FormUtils(this.form);


  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.activatedRoute.paramMap.pipe(switchMap((params: ParamMap) => this.accountService.getById(+params.get('id'))))
        .subscribe(
          (account: Account) => this.setAccount(account),
          error => {
            alert('An error ocurred. Please try again');
            this.router.navigate(['/accounts']);
          }
        );
    }
  }

  public setAccount(account: Account) {
    this.account = account;
    this.form.patchValue(account);
  }

  public createAccount() {
    this.newAccount = new Account(
      null,
      this.form.get('typeAccount').value,
      this.form.get('currency').value,
      +this.form.get('initialBalance').value,
      +this.form.get('initialBalance').value,
      +this.form.get('brokerId').value
    );
    this.submitted = true;

    this.accountService.create(this.newAccount)
      .subscribe(
        (account) => {
          this.form.reset();
          this.submitted = false;
          this.flashMessages.show(
            'Account created!',
            {
              cssClass: 'alert-success',
              timeout: 5000
            }
          );
          this.newAccount = new Account(
            null,
            '',
            '',
            0,
            0,
            null
          );
        },
        (error) => {
          this.submitted = false;
          if (error.status === 422) {
            this.messages = ['Account not created! Check the form.'];
          } else {
            this.messages = ['An error ocurred, please try again.'];
          }
          this.flashMessages.show(
            this.messages.join(' | '),
            {
              cssClass: 'alert-danger',
              timeout: 5000
            }
          );
        }
      );
  }

  public updateAccount() {
    this.account.typeAccount = this.form.get('typeAccount').value;
    this.account.currency = this.form.get('currency').value;
    this.account.initialBalance = this.form.get('initialBalance').value;
    this.account.brokerId = +this.form.get('brokerId').value;

    this.accountService.update(this.account)
      .subscribe(
        () => {
          this.flashMessages.show(
            'Account updated!',
            {
              cssClass: 'alert-success',
              timeout: 5000
            }
          );
        },
        () => {
          this.flashMessages.show(
            'Account not updated! Please try again',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            }
          );
        }
      );
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      typeAccount: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      initialBalance: [10, [Validators.required, Validators.min(10)]],
      brokerId: [null, [Validators.required]]
    });
  }


}
