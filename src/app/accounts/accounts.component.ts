import {Component, OnInit} from '@angular/core';
import {Account} from './shared/account.model';
import {AccountService} from './shared/account.service';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {BrokerService} from '../brokers/shared/broker.service';
import {Broker} from '../brokers/shared/broker.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  public accounts: Array<Account>;

  public constructor(
    private accountService: AccountService,
    private brokerService: BrokerService,
    private flashMessages: FlashMessagesService) {
  }

  ngOnInit() {
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

}
