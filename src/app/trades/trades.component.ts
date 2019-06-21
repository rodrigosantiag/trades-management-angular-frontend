import {Component, OnInit} from '@angular/core';
import {getCurrencySymbol} from '@angular/common';
import * as CanvasJS from '../../assets/canvasjs.min';
import {AccountService} from '../accounts/shared/account.service';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {Account} from '../accounts/shared/account.model';
import {Trade} from './shared/trade.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {AngularTokenService} from 'angular-token';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  public accountSelected: Account;
  public accountTrades: Array<Trade>;
  public accounts: Array<Account>;
  public currencyCode: string;
  public form: FormGroup;
  public formUtils: FormUtils;

  constructor(
    private accountService: AccountService,
    private flashMessageService: FlashMessagesService,
    private formBuilder: FormBuilder,
    private tokenService: AngularTokenService
  ) {
    this.accountSelected = null;
    this.currencyCode = '';
    this.accountTrades = [];
  }

  ngOnInit() {

    // TODO: implement chart when CRUD's done

    this.accountService.getAll('q[s]=broker_name')
      .subscribe(
        accounts => this.accounts = accounts,
        () => {
          this.flashMessageService.buildFlashMessage(
            ['Something went wrong. Please refresh page.'],
            0,
            true,
            'danger'
          );
        }
      );


    /* Chart
    const dataPoints = [];
    let y = 0;
    for (let i = 0; i < 100; i++) {
      y += Math.round(21151.94 + Math.random() * (-21151.94 - 21151.94));
      dataPoints.push({y});
    }
    const chart = new CanvasJS.Chart('chartContainer', {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      subtitles: [{
        text: 'Try Zooming and Panning'
      }],
      data: [
        {
          type: 'line',
          dataPoints
        }]
    });

    chart.render(); */
  }

  /*TODO: this is going to another component*/

  public selectAccount(event: any) {
    if (this.form) {
      this.form.controls = null;
    }
    this.accountService.getById(event.target.value)
      .subscribe(
        account => {
          this.accountSelected = account;
          this.currencyCode = getCurrencySymbol(this.accountSelected.currency, 'wide');
          this.accountTrades = account.trades;
          this.form = this.formBuilder.group({
            value: [
              account.currentBalance * account.risk / 100,
              [Validators.required, Validators.max(account.currentBalance)]
            ],
            profit: [null, [Validators.required]],
            result: [null, [Validators.required]],
            accountId: [account.id],
            typeTrade: ['T']
          });
        }
      );

  }

  public demoRealClass(): string {
    return this.accountSelected.typeAccount === 'D' ? 'demo' : 'real';
  }

}
