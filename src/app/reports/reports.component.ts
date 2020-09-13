import {Component, OnInit} from '@angular/core';
import {AccountService} from '../accounts/shared/account.service';
import {Account} from '../accounts/shared/account.model';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Strategy} from '../strategies/shared/strategy.model';
import {StrategyService} from '../strategies/shared/strategy.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TradeService} from '../trades/shared/trade.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  public maxDate: Date;
  public accounts: Array<Account>;
  public strategies: Array<Strategy>;
  public formFilter: FormGroup;
  public reportMeta: object;

  constructor(private accountService: AccountService, private flashMessagesService: FlashMessagesService,
              private strategyService: StrategyService, private formBuilder: FormBuilder, private tradeService: TradeService) {

    this.maxDate = new Date();

    this.formFilter = this.formBuilder.group({
      account_id_eq: [null, [Validators.required]],
      date_range: '',
      strategy_id_eq: ''
    });
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

  public getReport() {
    this.tradeService.analytics(this.formFilter.getRawValue()).subscribe(
      response => {
        console.log('response');
        console.log(response);
      },
      error => {
        console.log('error');
        console.log(error);
      },
      () => this.getMeta());
  //  TODO: mount reports on reports.component.html
  }

  private getMeta(): any {
    return this.tradeService.analyticsMeta(this.formFilter.getRawValue()).subscribe(
      responseMeta => {
        this.reportMeta = responseMeta;
        console.log(this.reportMeta);
      },
      error => {
        console.log('error meta');
        console.log(error);
      });
  }

}
