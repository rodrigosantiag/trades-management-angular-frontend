import {Component, OnDestroy, OnInit} from '@angular/core';
import {Trade} from '../shared/trade.model';
import {Account} from '../../accounts/shared/account.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../../shared/form.utils';
import {AngularTokenService} from 'angular-token';
import {getCurrencySymbol} from '@angular/common';
import {AccountService} from '../../accounts/shared/account.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

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
  public id: number;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenService: AngularTokenService
  ) {
    this.accountSelected = null;
    this.currencyCode = '';
    this.accountTrades = [];
    this.form = null;

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.accountService.getById(+this.activatedRoute.snapshot.paramMap.get('id'))
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
    });
  }

  ngOnInit() {}


  public demoRealClass(): string {
    return this.accountSelected.typeAccount === 'D' ? 'demo' : 'real';
  }

}
