import {Injectable} from '@angular/core';
import {AngularTokenModule, AngularTokenService} from 'angular-token';
import {Observable, throwError} from 'rxjs';
import {Broker} from './broker.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {parse} from '@fortawesome/fontawesome-svg-core';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  public brokersUrl = '/brokers';

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService) {
  }

  public getAll(): Observable<Broker[]> {
    return this.httpClient.get(this.tokenService.apiBase + this.brokersUrl)
      .pipe(
        catchError(this.handleErrors),
        map((response: HttpResponse<any>) => this.responseToBrokers(response)));
  }

  public create(broker: Broker): Observable<Broker> {
    const url = this.tokenService.apiBase + '/brokers';

    return this.httpClient.post(url, broker)
      .pipe(
        catchError(this.handleErrors),
        map((response: HttpResponse<any>) => this.responseToBroker(response))
      );
  }

  public responseToBrokers(response: any): Array<Broker> {
    const brokersArray = response.data;
    const brokers: Broker[] = [];
    brokersArray.forEach(item => {
      const broker = new Broker(
        item.id,
        item.attributes.name
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
