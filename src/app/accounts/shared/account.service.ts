import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AngularTokenService} from 'angular-token';
import {Account} from './account.model';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ErrorUtils} from '../../shared/error.utils';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public accountsUrl = this.tokenService.apiBase + '/accounts';

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService, private errorUtils: ErrorUtils) {
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
    return new Account(
      response.data.id,
      response.data.attributes['type-account'],
      response.data.attributes.currency,
      response.data.attributes['initial-balance'],
      response.data.attributes['current-balance'],
      response.data.attributes['broker-id'],
      response.data.attributes['created-date-formatted'],
      response.data.attributes.broker,
      response.data.attributes.trades,
      response.data.attributes['account-risk']
    );
  }

  private responseToAccounts(response: any): Array<Account> {
    const accounts: Array<Account> = [];

    response.data.forEach(item => {
      const account = new Account(
        item.id,
        item.attributes['type-account'],
        item.attributes.currency,
        item.attributes['initial-balance'],
        item.attributes['current-balance'],
        item.attributes['broker-id'],
        item.attributes['created-date-formatted'],
        item.attributes.broker
      );
      accounts.push(account);
    });

    return accounts;
  }
}
