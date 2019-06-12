import {Component, OnInit} from '@angular/core';
import {Account} from './shared/account.model';
import {AccountService} from './shared/account.service';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {BrokerService} from '../brokers/shared/broker.service';
import {Broker} from '../brokers/shared/broker.model';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

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

    this.accountService.gerAll()
      .subscribe(
        accounts => {
          this.accounts = accounts;
          console.log(accounts);
        },
        (response) => {
          if (response.errors) {
            this.flashMessages.buildFlashMessage(
              ['An error ocurred, please try again.'],
              0,
              true,
              'danger'
            );
          }
        }
      );
  }

  public filterAccounts() {
    const terms =
      `q[broker_id_eq]=${this.formFilter.get('broker_id').value}&q[type_account_eq]=${this.formFilter.get('type_account').value}`;

    this.accountService.gerAll(terms)
      .subscribe(
        accounts => this.accounts = accounts,
        () => {
          this.flashMessages.buildFlashMessage(
            ['An error ocuured. Please try again.'],
            5000,
            true,
            'danger'
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
            this.flashMessages.buildFlashMessage(
              ['Account deleted!'],
              5000,
              true,
              'success'
            );
          },
          () => {
            this.flashMessages.buildFlashMessage(
              ['Account not deleted due a server error. Please try again'],
              0,
              true,
              'danger'
            );
          }
        );
    }
  }

}
