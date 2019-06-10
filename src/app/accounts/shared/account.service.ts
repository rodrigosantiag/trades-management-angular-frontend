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

  public gerAll(): Observable<Account[]> {
    const url = this.accountsUrl;

    return this.httpClient.get(url)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((response: HttpResponse<any>) => this.responseToAccounts(response))
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

  private responseToAccount(response: any): Account {
    return new Account(
      response.data.id,
      response.data.attributes['type-account'],
      response.data.attributes.currency,
      response.data.attributes['initial-currency'],
      response.data.attributes['current-currency'],
      response.data.attributes['broker-id']
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
        item.attributes.broker
      );
      accounts.push(account);
    });

    return accounts;
  }
}
