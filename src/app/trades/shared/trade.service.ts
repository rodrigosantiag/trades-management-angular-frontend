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

  public update(trade: Trade): Observable<Trade> {
    const url = `${this.tradesUrl}/${trade.id}`;

    return this.httpClient.put(url, trade)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((updatedTrade: HttpResponse<any>) => this.responseToTrade(updatedTrade))
      );
  }

  public delete(id: number) {
    const url = `${this.tradesUrl}/${id}`;

    return this.httpClient.delete(url)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(() => null)
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
        item.attributes.account_id,
        item.attributes.strategy_id,
        item.attributes.created_date_formatted,
        item.attributes.type_trade,
        item.attributes.result_balance
      );
      trade.setStrategyFromIncluded(response.included);
      trades.push(trade);
    });

    return trades;
  }


  private responseToTrade(response: any): Trade {
    const trade = new Trade(
      response.data.id,
      response.data.attributes.value,
      response.data.attributes.profit,
      response.data.attributes.result,
      response.data.attributes.account_id,
      response.data.attributes.strategy_id,
      response.data.attributes.created_date_formatted,
      response.data.attributes.type_trade,
      response.data.attributes.result_balance
    );
    trade.setStrategyFromIncluded(response.included);

    return trade;
  }
}
