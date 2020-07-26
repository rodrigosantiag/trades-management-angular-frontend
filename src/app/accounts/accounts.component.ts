import {Component, OnInit} from '@angular/core';
import {Account} from './shared/account.model';
import {AccountService} from './shared/account.service';
import {BrokerService} from '../brokers/shared/broker.service';
import {Broker} from '../brokers/shared/broker.model';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  public brokers: Array<Broker>;
  public accounts: Array<Account>;
  public formFilter: FormGroup;

  public constructor(
    private accountService: AccountService,
    private brokerService: BrokerService,
    private flashMessages: FlashMessagesService,
    private formBuilder: FormBuilder) {

    this.formFilter = this.formBuilder.group({
      broker_id: '',
      type_account: ''
    });

  }

  ngOnInit() {

    this.brokerService.getAll()
      .subscribe(
        brokers => this.brokers = brokers
      );

    this.accountService.getAll()
      .subscribe(
        accounts => this.accounts = accounts,
        (response) => {
          if (response.errors) {
            this.flashMessages.show(
              'An error ocurred, please try again.',
              {
                cssClass: 'alert-danger',
                timeout: 5000
              }
            );
          }
        }
      );
  }

  public filterAccounts() {
    const terms =
      `q[broker_id_eq]=${this.formFilter.get('broker_id').value}&q[type_account_eq]=${this.formFilter.get('type_account').value}`;

    this.accountService.getAll(terms)
      .subscribe(
        accounts => this.accounts = accounts,
        () => {
          this.flashMessages.show(
            'An error ocuured. Please try again.',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            }
          );
        }
      );
  }

  public clearFilter() {
    this.formFilter.reset({broker_id: '', type_account: ''});
    this.filterAccounts();
  }

  public deleteAccount(account: Account) {
    if (confirm(`Do you really want to delete ${account.broker.name}'s ${account.getAccountType()}?`)) {
      this.accountService.delete(account.id)
        .subscribe(
          () => {
            this.accounts = this.accounts.filter(a => a !== account);
            this.flashMessages.show(
              'Account deleted!',
              {
                cssClass: 'alert-success',
                timeout: 5000
              }
            );
          },
          () => {
            this.flashMessages.show(
              'Account not deleted due a server error. Please try again',
              {
                cssClass: 'alert-danger',
                timeout: 5000
              }
            );
          }
        );
    }
  }

}
