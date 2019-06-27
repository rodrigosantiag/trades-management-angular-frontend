import {Component, OnDestroy, OnInit} from '@angular/core';
import {Trade} from '../shared/trade.model';
import {Account} from '../../accounts/shared/account.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../../shared/form.utils';
import {getCurrencySymbol} from '@angular/common';
import {AccountService} from '../../accounts/shared/account.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TradeService} from '../shared/trade.service';
import {FlashMessagesService} from '../../shared/flashMessages.service';
import {element} from 'protractor';

@Component({
  selector: 'app-trades-account',
  templateUrl: './trades-account.component.html',
  styleUrls: ['./trades-account.component.css']
})
export class TradesAccountComponent implements OnInit {
  public accountSelected: Account;
  public accountTrades: Array<Trade>;
  public currencyCode: string;
  public form: FormGroup;
  public formUtils: FormUtils;
  public newTrade: Trade;
  public submitted: boolean;
  public currentBalance: number;
  public dataPoints: Array<any>;
  public y: number;

  /* Chart's variables */
  public view: Array<any>;
  public showXAxis: boolean;
  public showYAxis: boolean;
  public gradient: boolean;
  public showLegend: boolean;
  public showXAxisLabel: boolean;
  public xAxisLabel: string;
  public showYAxisLabel: boolean;
  public yAxisLabel: string;
  public colorScheme: object;
  public multi: Array<any>;
  public autoScale: boolean;



  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private flashMessages: FlashMessagesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tradeService: TradeService
  ) {
    this.accountSelected = null;
    this.currencyCode = '';
    this.accountTrades = [];
    this.form = null;
    this.submitted = false;

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url.startsWith('/trades/trades-account/')) {
        this.accountService.getById(+this.activatedRoute.snapshot.paramMap.get('id'))
          .subscribe(
            account => {
              this.accountSelected = account;
              this.currentBalance = account.currentBalance;
              this.currencyCode = getCurrencySymbol(this.accountSelected.currency, 'wide');
              this.accountTrades = account.trades;
              this.form = this.formBuilder.group({
                value: [
                  account.currentBalance * account.risk / 100,
                  [Validators.required, Validators.min(1), Validators.max(account.currentBalance)]
                ],
                profit: [null, [Validators.required]],
                result: [null, [Validators.required]],
                accountId: [account.id],
                typeTrade: ['T']
              });
              this.formUtils = new FormUtils(this.form);
              this.y = +this.accountSelected.initialBalance;
              this.dataPoints = [{name: new Date(this.accountSelected.createdDateFormatted), value: this.y}];
              account.trades.map(trade => {
                this.y = this.y + +trade['result-balance'];
                this.dataPoints.push({name: new Date(trade['created-date-formatted']), value: this.y});
              });

              // options
              this.showXAxis = true;
              this.showYAxis = true;
              this.gradient = false;
              this.showLegend = true;
              this.autoScale = true;
              this.showXAxisLabel = true;
              this.showYAxisLabel = true;
              this.yAxisLabel = 'Account Balance';

              this.colorScheme = {
                domain: ['#5AA454']
              };

              this.multi = [
                {
                  name: 'Trades',
                  series: this.dataPoints
                }
              ];
            }
          );
      }
    });
  }

  ngOnInit() {
  }

  public createTrade() {
    this.submitted = true;
    this.newTrade = new Trade(
      null,
      +this.form.get('value').value,
      +this.form.get('profit').value,
      this.form.get('result').value,
      +this.form.get('accountId').value,
      this.form.get('typeTrade').value
    );

    this.tradeService.create(this.newTrade)
      .subscribe(
        newTrade => {
          this.accountTrades.push(newTrade);
          this.currentBalance = +this.currentBalance + +newTrade.resultBalance;
          this.y = this.y + +newTrade.resultBalance;
          this.dataPoints.push({name: new Date(newTrade.createdDateFormatted), value: this.y});
          this.multi = [
            {
              name: 'Trades',
              series: this.dataPoints
            }
          ];
          console.log(this.dataPoints);
          this.newTrade = new Trade(
            null,
            null,
            null,
            null,
            null,
            null
          );
          this.form.get('profit').reset();
          this.form.get('result').reset();
        },
        () => {
          this.flashMessages.buildFlashMessage(
            ['An error ocurred. Please try again.'],
            5000,
            true,
            'danger'
          );
        }
      );
    this.submitted = false;
  }


  public demoRealClass(): string {
    return this.accountSelected.typeAccount === 'D' ? 'demo' : 'real';
  }

  public winLoseClass(trade: Trade): string {
    return trade.result ? 'win' : 'lose';
  }

}
