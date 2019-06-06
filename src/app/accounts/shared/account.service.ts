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

  public create(account: Account): Observable<Account> {
    return this.httpClient.post(this.accountsUrl, account)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((response: HttpResponse<any>) => this.responseToAccount(response))
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
}
