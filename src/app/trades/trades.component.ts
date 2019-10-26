import {Component, OnInit} from '@angular/core';
import {AccountService} from '../accounts/shared/account.service';
import {FlashMessagesService} from '../shared/flashMessages.service';
import {Account} from '../accounts/shared/account.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TradesAccountComponent} from './trades-account/trades-account.component';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  public accounts: Array<Account>;
  public tradesAccount: TradesAccountComponent;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private flashMessageService: FlashMessagesService,
    private router: Router
  ) {
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

  public goToTrades(event: any) {
    this.router.navigate(['trades/trades-account', event.target.value]);
  }
}
