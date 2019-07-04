import {Injectable} from '@angular/core';
import {Trade} from './trade.model';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AngularTokenService} from 'angular-token';
import {ErrorUtils} from '../../shared/error.utils';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  public tradesUrl = this.tokenService.apiBase + '/trades';

  public constructor(private httpClient: HttpClient, private tokenService: AngularTokenService, private errorUtils: ErrorUtils) {
  }

  public getTrades(accountId: number = null, page: number = null): Observable<any> {
    const url = `${this.tradesUrl}?account_id=${accountId}&page=${page}`;

    return this.httpClient.get(url, {observe: 'response'})
      .pipe(
        map((response) => {
          return {
            headers: response.headers.get('total'),
            trades: this.responseToTrades(response.body)
          };
        }),
        catchError(this.errorUtils.handleErrors)
      );
  }

  public create(trade: Trade): Observable<Trade> {
    return this.httpClient.post(this.tradesUrl, trade)
      .pipe(
        map((response: HttpResponse<any>) => this.responseToTrade(response)),
        catchError(this.errorUtils.handleErrors)
      );
  }

  private responseToTrades(response: any): Array<Trade> {
    const trades: Array<Trade> = [];

    response.data.forEach(item => {
      const trade = new Trade(
        item.id,
        item.attributes.value,
        item.attributes.profit,
        item.attributes.result,
        item.attributes['account-id'],
        item.attributes['created-date-formatted'],
        item.attributes['type-trade'],
        item.attributes['result-balance'],
        item.attributes.account
      );
      trades.push(trade);
    });

    return trades;
  }


  private responseToTrade(response: any): Trade {
    return new Trade(
      response.data.id,
      response.data.attributes.value,
      response.data.attributes.profit,
      response.data.attributes.result,
      response.data.attributes['account-id'],
      response.data.attributes['created-date-formatted'],
      response.data.attributes['type-trade'],
      response.data.attributes['result-balance'],
      response.data.attributes.account
    );
  }
}
