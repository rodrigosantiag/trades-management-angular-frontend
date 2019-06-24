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

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService, private errorUtils: ErrorUtils) {
  }


  public create(trade: Trade): Observable<Trade> {
    return this.httpClient.post(this.tradesUrl, trade)
      .pipe(
        map((response: HttpResponse<any>) => this.responseToTrade(response)),
        catchError(this.errorUtils.handleErrors)
      );
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
