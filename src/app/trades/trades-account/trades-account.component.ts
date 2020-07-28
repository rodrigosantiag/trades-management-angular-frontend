// tslint:disable-next-line:max-line-length
// TODO: For real account => Deposit/Withdrawal: both will be added as a trade of types 'D' and 'W'. In trade's list their display should
//  different (think about best way to do it)
// TODO: For demo account will be a trade type 'R' and refunding value difference from balance should be added to account balance. Its
// displaying have to be thought too

import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Trade} from '../shared/trade.model';
import {Account} from '../../accounts/shared/account.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../../shared/form.utils';
import {getCurrencySymbol} from '@angular/common';
import {AccountService} from '../../accounts/shared/account.service';
import {ActivatedRoute, NavigationEnd, ResolveEnd, Router} from '@angular/router';
import {TradeService} from '../shared/trade.service';
import {PaginationInstance} from 'ngx-pagination';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Strategy} from '../../strategies/shared/strategy.model';
import {StrategyService} from '../../strategies/shared/strategy.service';
import {Observable} from 'rxjs';
import {delay} from 'rxjs/operators';

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
  public strategies: Array<Strategy>;
  public currentBalance: number;
  public editingTrade: Trade;
  public formEdit: FormGroup;
  public formEditUtils: FormUtils;
  public isEditing: boolean;
  @ViewChild('closeBtn') public closeBtn: ElementRef;

  /* Chart's variables */
  public dataPoints: Array<any>;
  public y: number;
  public showXAxis: boolean;
  public showYAxis: boolean;
  public gradient: boolean;
  public showLegend: boolean;
  public showXAxisLabel: boolean;
  public showYAxisLabel: boolean;
  public yAxisLabel: string;
  public colorScheme: object;
  public multi: Array<any>;
  public autoScale: boolean;

  // Pagination
  public config: PaginationInstance;
  public total: number;
  public counter: number;


  public constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private flashMessages: FlashMessagesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tradeService: TradeService,
    private strategyService: StrategyService
  ) {
    this.counter = 0;
    this.accountSelected = null;
    this.currencyCode = '';
    this.accountTrades = [];
    this.form = null;
    this.submitted = false;
    this.editingTrade = new Trade(null, null, null, null, null, null);
    this.isEditing = false;
    this.strategyService.getAll().subscribe(
      strategies => this.strategies = strategies,
      () => {
        this.flashMessages.show(
          'Something went wrong. Please try again.',
          {
            cssClass: 'alert-danger',
            timeout: 5000
          }
        );
      }
    );

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url.startsWith(`/trades/trades-account/${this.activatedRoute.snapshot.paramMap.get('id')}`)) {
        this.accountService.getById(+this.activatedRoute.snapshot.paramMap.get('id'))
          .subscribe(account => {
              this.accountSelected = account;
              this.form = this.setUpForm();
              this.formUtils = new FormUtils(this.form);
              this.currentBalance = this.accountSelected.currentBalance;
              this.currencyCode = getCurrencySymbol(this.accountSelected.currency, 'wide');
              this.y = +this.accountSelected.initialBalance;
              this.dataPoints = [{name: new Date(this.accountSelected.createdDateFormatted), value: this.y, id: 0}];
              this.accountSelected.trades.map(trade => {
                this.y = this.y + +trade['result-balance'];
                this.dataPoints.push({name: new Date(trade['created-date-formatted']), value: this.y, id: trade.id});
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
                  name: 'Balance',
                  series: this.dataPoints
                }
              ];
            },
            error => {
              this.flashMessages.show(
                'An error ocurred. Please try again',
                {
                  cssClass: 'alert-danger',
                  timeout: 5000
                });
            },
            () => this.getPage(1));
      }
    });
  }

  ngOnInit() {
  }

  public getPage(page: number) {
    this.tradeService.getTrades(this.accountSelected.id, page)
      .subscribe(
        response => {
          this.config = {
            id: 'custom',
            currentPage: page,
            itemsPerPage: 10,
            totalItems: response.headers
          };
          this.accountTrades = response.trades;
        }
      );
  }

  public createTrade() {
    this.submitted = true;
    this.newTrade = new Trade(
      null,
      +this.form.get('value').value,
      +this.form.get('profit').value,
      this.form.get('result').value,
      +this.form.get('accountId').value,
      +this.form.get('strategyId').value,
      this.form.get('typeTrade').value
    );

    this.tradeService.create(this.newTrade)
      .subscribe(
        newTrade => {
          this.accountTrades.unshift(newTrade);
          this.currentBalance = +this.currentBalance + +newTrade.resultBalance;
          this.y = this.y + +newTrade.resultBalance;
          this.dataPoints.push({name: new Date(newTrade.createdDateFormatted), value: this.y, id: +newTrade.id});
          this.multi = [
            {
              name: 'Balance',
              series: this.dataPoints
            }
          ];
          this.newTrade = new Trade(
            null,
            null,
            null,
            null,
            null,
            null,
            null
          );
          this.form.get('profit').reset();
          this.form.get('result').reset();
          this.getPage(this.config.currentPage);
          this.submitted = false;
        },
        () => {
          this.flashMessages.show(
            'An error ocurred. Please try again.',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            });
          this.submitted = false;
        }
      );
  }

  public beginEdit(trade: Trade) {
    this.formEdit = null;
    this.isEditing = true;
    this.editingTrade = trade;
    this.formEdit = this.setUpForm();
    this.formEdit.patchValue(trade);
    this.formEditUtils = new FormUtils(this.formEdit);
  }

  public updateTrade(trade: Trade) {
    this.submitted = true;
    const beforeValue = +trade.resultBalance;
    trade.value = this.formEdit.value.value;
    trade.profit = this.formEdit.value.profit;
    trade.result = this.formEdit.value.result;
    trade.strategyId = this.formEdit.value.strategyId;

    this.tradeService.update(trade)
      .subscribe(
        updatedTrade => {
          // Find trade index in item and data points array
          const itemIndex = this.accountTrades.findIndex(item => item.id === updatedTrade.id);
          const chartIndex = this.dataPoints.findIndex(item => item.id === +updatedTrade.id);
          // Calculate new result balance
          let newResultBalance = this.dataPoints[chartIndex].value + (+updatedTrade.resultBalance - beforeValue);
          this.accountTrades[itemIndex] = updatedTrade;
          // Update current balance
          this.currentBalance = +this.currentBalance + (+updatedTrade.resultBalance - beforeValue);
          // Update right and next data points values
          this.dataPoints.map((item, index) => {
            if (index >= chartIndex) {
              newResultBalance = item.value + (+updatedTrade.resultBalance - beforeValue);
              this.dataPoints[index] = {
                name: item.name,
                value: newResultBalance,
                id: +item.id
              };
            }
          });
          this.multi = [
            {
              name: 'Balance',
              series: this.dataPoints
            }
          ];
          this.flashMessages.show(
            `Trade #${updatedTrade.id} successfuly updated!`,
            {
              cssClass: 'alert-success',
              timeout: 5000
            });
        },
        () => {
          this.flashMessages.show(
            'An error ocurred, please rty again',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            });
        }
      );
    this.submitted = false;
    this.closeBtn.nativeElement.click();
  }

  public deleteTrade(trade: Trade) {
    if (confirm(`Do you really want to delete trade #${trade.id}?`)) {
      this.tradeService.delete(trade.id)
        .subscribe(
          () => {
            // Find trade index in item and data points array
            const chartIndex = this.dataPoints.findIndex(item => item.id === +trade.id);
            // Calculate new result balance
            let newResultBalance = this.dataPoints[chartIndex].value - +trade.resultBalance;
            // Update current balance
            this.currentBalance = +this.currentBalance - +trade.resultBalance;
            // Update right and next data points values
            this.dataPoints.map((item, index) => {
              if (index >= chartIndex) {
                newResultBalance = item.value - +trade.resultBalance;
                this.dataPoints[index] = {
                  name: item.name,
                  value: newResultBalance,
                  id: +item.id
                };
              }
            });
            this.multi = [
              {
                name: 'Balance',
                series: this.dataPoints
              }
            ];
            this.accountTrades = this.accountTrades.filter(a => a !== trade);
            this.flashMessages.show(
              `Trade #${trade.id} deleted!`,
              {
                cssClass: 'alert-success',
                timeout: 5000
              });
          },
          () => {
            this.flashMessages.show(
              `Trade #${trade.id} not deleted due to a server error. Please try again.`,
              {
                cssClass: 'alert-danger',
                timeout: 5000
              });
          }
        );
    }
  }

  public demoRealClass(): string {
    return this.accountSelected.typeAccount === 'D' ? 'demo' : 'real';
  }

  public winLoseClass(trade: Trade): string {
    return trade.result ? 'win' : 'lose';
  }

  public setUpForm(): FormGroup {
    return this.formBuilder.group({
      value: [
        this.accountSelected.currentBalance * this.accountSelected.risk / 100,
        [Validators.required, Validators.min(1), Validators.max(this.accountSelected.currentBalance)]
      ],
      profit: [null, [Validators.required]],
      result: [null, [Validators.required]],
      accountId: [this.accountSelected.id],
      strategyId: [null, [Validators.required]],
      typeTrade: ['T']
    });
  }

}
