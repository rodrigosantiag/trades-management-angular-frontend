import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AngularTokenService} from 'angular-token';
import {Account} from './account.model';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ErrorUtils} from '../../shared/error.utils';
import {Trade} from '../../trades/shared/trade.model';
import {BrokerService} from '../../brokers/shared/broker.service';
import {Broker} from '../../brokers/shared/broker.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public accountsUrl = this.tokenService.apiBase + '/accounts';

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService, private errorUtils: ErrorUtils,
              private brokerService: BrokerService) {
  }

  public getAll(terms: string = ''): Observable<Account[]> {
    const url = `${this.accountsUrl}?${terms}`;

    return this.httpClient.get(url)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((response: HttpResponse<any>) => this.responseToAccounts(response))
      );
  }

  public getById(id: number): Observable<Account> {
    const url = `${this.accountsUrl}/${id}`;

    return this.httpClient.get(url)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(account => this.responseToAccount(account))
      );
  }

  public create(account: Account): Observable<Account> {
    return this.httpClient.post(this.accountsUrl, account)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((response: HttpResponse<any>) => this.responseToAccount(response))
      );
  }

  public update(account: Account): Observable<Account> {
    const url = `${this.accountsUrl}/${account.id}`;

    return this.httpClient.put(url, account)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(updatedAccount => this.responseToAccount(updatedAccount))
      );
  }

  public delete(id: number): Observable<null> {
    const url = `${this.accountsUrl}/${id}`;

    return this.httpClient.delete(url)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(() => null)
      );
  }

  private responseToAccount(response: any): Account {
    let tradesAccount: Array<Trade> = [];

    if (response.included !== undefined) {
      tradesAccount = response.included.map(trade => {
        if (trade.type === 'trades') {
          return new Trade(trade.id, trade.attributes.value, trade.attributes.profit, trade.attributes.result,
            trade.attributes.account_id, trade.attributes.strategy_id, trade.attributes.created_date_formatted, trade.attributes.type_trade,
            trade.attributes.result_balance, trade.attributes.account, trade.attributes.strategy);
        }
      });
    }

    tradesAccount = tradesAccount.filter(value => value !== undefined);

    return new Account(
      response.data.id,
      response.data.attributes.type_account,
      response.data.attributes.currency,
      response.data.attributes.initial_balance,
      response.data.attributes.current_balance,
      response.data.relationships.broker.data.id,
      response.data.attributes.created_date_formatted,
      this.getAccountBroker(response.data.id, response.included),
      tradesAccount,
      response.data.attributes.account_risk
    );
  }

  private responseToAccounts(response: any): Array<Account> {
    const accounts: Array<Account> = [];

    response.data.forEach(item => {
      const accountBroker = this.getAccountBroker(item.relationships.broker.data.id, response.included);
      const account = new Account(
        item.id,
        item.attributes.type_account,
        item.attributes.currency,
        item.attributes.initial_balance,
        item.attributes.current_balance,
        item.attributes.broker_id,
        item.attributes.created_date_formatted,
        accountBroker
      );
      accounts.push(account);
    });

    return accounts;
  }

  public getAccountBroker(brokerId: string, responseIncluded: Array<any>): Broker {
    let broker: Broker = new Broker(null, null);
    responseIncluded.filter((k) => {
      if (k.type === 'brokers' && k.id === brokerId) {
        broker = new Broker(
          k.id,
          k.attributes.name
        );
      }
    });

    return broker;
  }
}
