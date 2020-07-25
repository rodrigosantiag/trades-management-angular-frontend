import {Injectable} from '@angular/core';
import {AngularTokenService} from 'angular-token';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ErrorUtils} from '../../shared/error.utils';
import {Observable} from 'rxjs';
import {Strategy} from './strategy.model';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  public strategiesUrl = this.tokenService.apiBase + '/strategies';

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService, private errorUtils: ErrorUtils) {
  }

  public getAll(): Observable<Strategy[]> {
    return this.httpClient.get(this.strategiesUrl)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((response: HttpResponse<any>) => this.responseToStrategies(response))
      );
  }

  public create(strategy: Strategy): Observable<Strategy> {
    return this.httpClient.post(this.strategiesUrl, strategy)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((response: HttpResponse<any>) => this.responseToStrategy(response))
      );
  }

  public update(strategy: Strategy): Observable<Strategy> {
    const url = `${this.strategiesUrl}/${strategy.id}`;

    return this.httpClient.put(url, strategy)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(updatedStrategy => this.responseToStrategy(updatedStrategy))
      );
  }

  public delete(id: number): Observable<null> {
    const url = `${this.strategiesUrl}/${id}`;

    return this.httpClient.delete(url)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(() => null)
      );
  }

  public responseToStrategies(response: any): Array<Strategy> {
    const strategiesArray = response.data;
    const strategies: Strategy[] = [];

    strategiesArray.forEach(item => {
      const strategy = new Strategy(
        item.id,
        item.attributes.name
      );
      strategies.push(strategy);
    });
    return strategies;
  }

  public responseToStrategy(response: any): Strategy {
    return new Strategy(
      response.data.id,
      response.data.attributes.name
    );
  }
}
