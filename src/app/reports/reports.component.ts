import {Component, OnInit} from '@angular/core';
import {AccountService} from '../accounts/shared/account.service';
import {Account} from '../accounts/shared/account.model';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Strategy} from '../strategies/shared/strategy.model';
import {StrategyService} from '../strategies/shared/strategy.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TradeService} from '../trades/shared/trade.service';
import {Trade} from '../trades/shared/trade.model';

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
  public reportTrades: Array<Trade>;
  public noTrades: boolean;
  public submitted: boolean;

  /* Line chart's variables */
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

  /* Horizontal chart's variables */
  public itmOtmGeneralView: any[] = [700, 150];
  public itmOtmGeneralShowXAxis = true;
  public itmOtmGeneralShowYAxis = true;
  public itmOtmGeneralGradient = false;
  public itmOtmGeneralShowLegend = true;
  public itmOtmGeneralShowXAxisLabel = true;
  public itmOtmGeneralYAxisLabel = 'ITM/OTM';
  public itmOtmGeneralShowYAxisLabel = false;
  public itmOtmGeneralXAxisLabel = 'Assertiveness rate';
  public itmOtmGeneralData: Array<any>;

  /* Horizontal chart's variables (monthly) */
  public itmOtmMonthlyShowXAxis = true;
  public itmOtmMonthlyShowYAxis = true;
  public itmOtmMonthlyGradient = false;
  public itmOtmMonthlyShowLegend = true;
  public itmOtmMonthlyShowXAxisLabel = true;
  public itmOtmMonthlyYAxisLabel = 'Month';
  public itmOtmMonthlyShowYAxisLabel = true;
  public itmOtmMonthlyXAxisLabel = 'Assertiveness rate';
  public itmOtmMonthlyData: Array<any>;

  public itmOtmGeneralColorScheme = {
    domain: ['#5AA454', '#A10A28']
  };


  constructor(private accountService: AccountService, private flashMessagesService: FlashMessagesService,
              private strategyService: StrategyService, private formBuilder: FormBuilder, private tradeService: TradeService) {

    this.maxDate = new Date();

    this.formFilter = this.formBuilder.group({
      account_id_eq: [null, [Validators.required]],
      date_range: '',
      strategy_id_eq: '',
      type_eq: 'T'
    });

    this.reportTrades = [];

    this.noTrades = false;
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
    this.submitted = true;
    this.tradeService.analytics(this.formFilter.getRawValue()).subscribe(
      trades => {
        if (trades.length > 0) {
          this.noTrades = false;
          this.y = +trades[0].resultBalance;
          this.dataPoints = [{name: new Date(trades[0].createdDateFormatted), value: this.y, id: trades[0].id}];
          if (trades.length > 1) {
            trades.shift();
            trades.map(trade => {
              this.y = this.y + +trade.resultBalance;
              this.dataPoints.push({name: new Date(trade.createdDateFormatted), value: this.y, id: trade.id});
            });
          }


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
        } else {
          this.noTrades = true;
        }
        this.submitted = false;
      },
      error => {
        this.flashMessagesService.show(
          'An error ocurred. Please try again',
          {
            cssClass: 'alert-danger',
            timeout: 5000
          });
      },
      () => this.getMeta());
    //  TODO: implement itm/otm graphics
  }

  private getMeta(): any {
    return this.tradeService.analyticsMeta(this.formFilter.getRawValue()).subscribe(
      responseMeta => {
        console.log(responseMeta);
        this.itmOtmGeneralData = [{
          name: 'ITM/OTM',
          series: [
            {
              name: 'ITM',
              value: responseMeta.itm_otm_general.itm
            },
            {
              name: 'OTM',
              value: responseMeta.itm_otm_general.otm
            }
          ]
        }];
        // TODO: check reason why not loading September results
        this.itmOtmMonthlyData = [];
        for (const [key, value] of Object.entries(responseMeta.itm_otm_monthly)) {
          const month: any = key;
          const result: any = value;
          this.itmOtmMonthlyData.push({
            name: month,
            series: [
              {
                name: 'ITM',
                value: result.itm
              },
              {
                name: 'OTM',
                value: result.otm
              }
            ]
          });
        }
      },
      error => {
        this.flashMessagesService.show(
          'An error ocurred. Please try again',
          {
            cssClass: 'alert-danger',
            timeout: 5000
          });
      });
  }

}
