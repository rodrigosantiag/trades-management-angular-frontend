import {Component, OnInit} from '@angular/core';
import {AccountService} from '../accounts/shared/account.service';
import {Account} from '../accounts/shared/account.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TradesAccountComponent} from './trades-account/trades-account.component';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  public accounts: Array<Account>;
  public tradesAccount: TradesAccountComponent;
  public isDisabled: boolean;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private flashMessageService: FlashMessagesService,
    private router: Router
  ) {
  }

  ngOnInit() {

    this.isDisabled = false;

    // TODO: implement chart when CRUD's done

    this.accountService.getAll('q[s]=broker_name')
      .subscribe(
        accounts => this.accounts = accounts,
        () => {
          this.flashMessageService.show(
            'Something went wrong. Please refresh page.',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            });
        }
      );
  }

  public goToTrades(event: any) {
    this.isDisabled = true;
    this.router.navigate(['trades/trades-account', event.target.value]);
  }
}
