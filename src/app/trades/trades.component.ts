import {Component, OnInit} from '@angular/core';
import {getCurrencySymbol} from '@angular/common';
import * as CanvasJS from '../../assets/canvasjs.min';
import {AccountService} from '../accounts/shared/account.service';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {Account} from '../accounts/shared/account.model';
import {Trade} from './shared/trade.model';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  public accounts: Array<Account>;
  public accountSelected: Account;
  public currencyCode: string;
  public accountTrades: Array<Trade>;

  constructor(private accountService: AccountService, private flashMessageService: FlashMessagesService) {
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

  public selectAccount(event: any) {
    this.accountService.getById(event.target.value)
      .subscribe(
        account => {
          this.accountSelected = account;
          this.currencyCode = getCurrencySymbol(this.accountSelected.currency, 'wide');
          this.accountTrades = account.trades;
        }
      );

  }

  public demoRealClass(): string {
    return this.accountSelected.typeAccount === 'D' ? 'demo' : 'real';
  }

}
