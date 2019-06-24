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

import * as CanvasJS from '../../../assets/canvasjs.min.js';

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
              this.accountTrades = account.trades.sort((a, b) => {
                if (a.id < b.id) {
                  return 1;
                }
              });
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
              // TODO: update chart when trade is added. Check points positioning
              let y = +this.accountSelected.initialBalance;
              const dataPoints = [{x: new Date(this.accountSelected.createdDateFormatted), y}];
              this.accountSelected.trades.reverse().map(trade => {
                y = y + +trade['result-balance'];
                dataPoints.push({x: new Date(trade['created-date-formatted']), y});
              });
              const chart = new CanvasJS.Chart('chartContainer', {
                zoomEnabled: true,
                animationEnabled: true,
                exportEnabled: true,
                subtitles: [{
                  text: 'Try Zooming and Panning'
                }],
                axisX: {
                  valueFormatString: 'MM/DD/YYYY H:mm'
                },
                data: [
                  {
                    type: 'line',
                    dataPoints
                  }]
              });

              chart.render();
            }
          );
      }
    });
  }

  ngOnInit() {}

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
          this.accountTrades.unshift(newTrade);
          this.currentBalance = +this.currentBalance + +newTrade.resultBalance;
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
