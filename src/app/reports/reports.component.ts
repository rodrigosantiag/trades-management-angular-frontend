import {Component, OnInit} from '@angular/core';
import {AccountService} from '../accounts/shared/account.service';
import {Account} from '../accounts/shared/account.model';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Strategy} from '../strategies/shared/strategy.model';
import {StrategyService} from '../strategies/shared/strategy.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  public maxDate: Date;
  public accounts: Array<Account>;
  public strategies: Array<Strategy>;

  constructor(private accountService: AccountService, private flashMessagesService: FlashMessagesService,
              private strategyService: StrategyService) {

    this.maxDate = new Date();

  }

  ngOnInit(): void {
    this.accountService.getAll()
      .subscribe(accounts => this.accounts = accounts,
        () => {
          this.flashMessagesService.show(
            'Something went wrong. Please refresh page.',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            });
        });

    this.strategyService.getAll()
      .subscribe(strategies => this.strategies = strategies,
        () => {
          this.flashMessagesService.show(
            'Something went wrong. Please refresh page.',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            });
        });
  }

}
