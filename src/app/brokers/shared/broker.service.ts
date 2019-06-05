import {Injectable} from '@angular/core';
import {AngularTokenModule, AngularTokenService} from 'angular-token';
import {Observable, throwError} from 'rxjs';
import {Broker} from './broker.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {parse} from '@fortawesome/fontawesome-svg-core';
import {AccountModel} from '../../accounts/shared/account.model';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  public brokersUrl = this.tokenService.apiBase + '/brokers';

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService) {
  }

  public getAll(): Observable<Broker[]> {
    return this.httpClient.get(this.brokersUrl)
      .pipe(
        catchError(this.handleErrors),
        map((response: HttpResponse<any>) => this.responseToBrokers(response)));
  }

  public create(broker: Broker): Observable<Broker> {
    return this.httpClient.post(this.brokersUrl, broker)
      .pipe(
        catchError(this.handleErrors),
        map((response: HttpResponse<any>) => this.responseToBroker(response))
      );
  }

  public delete(id: number): Observable<null> {
    const url = `${this.brokersUrl}/${id}`;

    return this.httpClient.delete(url)
      .pipe(
        catchError(this.handleErrors),
        map(() => null)
      );
  }

  public update(broker: Broker): Observable<Broker> {
    const url = `${this.brokersUrl}/${broker.id}`;

    return this.httpClient.put(url, broker)
      .pipe(
        catchError(this.handleErrors),
        map(
          updatedBroker => this.responseToBroker(updatedBroker)
        )
      );
  }

  public responseToBrokers(response: any): Array<Broker> {
    const brokersArray = response.data;
    const brokers: Broker[] = [];
    brokersArray.forEach(item => {
      const broker = new Broker(
        item.id,
        item.attributes.name,
        item.relationships.accounts.data.map(account => {
          return new AccountModel(
            account.id,
            account['type-account'],
            account.currency,
            account['initial-balance'],
            account['current-balance'],
            account['broker-id']);
        })
      );
      brokers.push(broker);
    });
    return brokers;
  }

  public responseToBroker(response: any): Broker {
    return new Broker(
      response.data.id,
      response.data.attributes.name
    );
  }

  public handleErrors(response: HttpResponse<any>) {
    return throwError(response);
  }
}
