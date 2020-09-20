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
        map((tradesResponse) => {
          return {
            headers: tradesResponse.headers.get('total'),
            trades: this.responseToTrades(tradesResponse.body)
          };
        }),
        catchError(this.errorUtils.handleErrors)
      );
  }

  public create(trade: Trade): Observable<Trade> {
    return this.httpClient.post(this.tradesUrl, trade)
      .pipe(
        map((createdTrade: HttpResponse<any>) => this.responseToTrade(createdTrade)),
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

  public analytics(formValues: object): Observable<any> {
    return this.callAnalytics(formValues)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((reportResponse) => this.responseToTrades(reportResponse))
      );
  }

  public analyticsMeta(formValues: object): Observable<any> {
    return this.callAnalytics(formValues)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((reportResponse) => reportResponse.meta)
      );
  }

  private responseToTrades(tradesResponse: any): Array<Trade> {
    const trades: Array<Trade> = [];

    // console.log(tradesResponse);

    tradesResponse.data.forEach(item => {
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
      trade.setStrategyFromIncluded(tradesResponse.included);
      trades.push(trade);
    });

    return trades;
  }


  private responseToTrade(tradeResponse: any): Trade {
    const trade = new Trade(
      tradeResponse.data.id,
      tradeResponse.data.attributes.value,
      tradeResponse.data.attributes.profit,
      tradeResponse.data.attributes.result,
      tradeResponse.data.attributes.account_id,
      tradeResponse.data.attributes.strategy_id,
      tradeResponse.data.attributes.created_date_formatted,
      tradeResponse.data.attributes.type_trade,
      tradeResponse.data.attributes.result_balance
    );
    trade.setStrategyFromIncluded(tradeResponse.included);

    return trade;
  }

  // private responseToMeta(meta: any): object {
  //   const metaObj = {};
  //   meta.forEach((value, key) => {
  //     metaObj[key] = value;
  //   });
  //
  //   return metaObj;
  // }

  private createParams(formValues: any): object {

    let dateFrom = null;
    let dateTo = null;

    formValues.date_range.forEach((value, key) => {
      key === 0 ? dateFrom = value : dateTo = value;
    });

    return {
      q: {
        account_id_eq: formValues.account_id_eq,
        created_at_gteq: dateFrom,
        created_at_lteq: dateTo,
        strategy_id_eq: formValues.strategy_id_eq
      }
    };
  }

  private callAnalytics(formValues: object): Observable<any> {
    const url = `${this.tradesUrl}/analytics`;

    return this.httpClient.post(url, this.createParams(formValues));
  }
}
