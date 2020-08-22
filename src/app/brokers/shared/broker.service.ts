import {Injectable} from '@angular/core';
import {AngularTokenService} from 'angular-token';
import {Observable} from 'rxjs';
import {Broker} from './broker.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ErrorUtils} from '../../shared/error.utils';
import {Account} from '../../accounts/shared/account.model';
import {AccountService} from '../../accounts/shared/account.service';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  public brokersUrl = this.tokenService.apiBase + '/brokers';

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService, private errorUtils: ErrorUtils,
              private accountService: AccountService) {
  }

  public getAll(): Observable<Broker[]> {
    return this.httpClient.get(this.brokersUrl)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((response: HttpResponse<any>) => this.responseToBrokers(response)));
  }

  public create(broker: Broker): Observable<Broker> {
    return this.httpClient.post(this.brokersUrl, broker)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map((response: HttpResponse<any>) => this.responseToBroker(response))
      );
  }

  public delete(id: number): Observable<null> {
    const url = `${this.brokersUrl}/${id}`;

    return this.httpClient.delete(url)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(() => null)
      );
  }

  public update(broker: Broker): Observable<Broker> {
    const url = `${this.brokersUrl}/${broker.id}`;

    return this.httpClient.put(url, broker)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(
          updatedBroker => this.responseToBroker(updatedBroker)
        )
      );
  }

  public responseToBroker(response: any): Broker {
    console.log(response);
    let accountsBroker: Array<Account> = [];
    accountsBroker = this.accountService.getBrokerAccounts(response.data.relationships.accounts.data, response.included);

    return new Broker(
      response.data.id,
      response.data.attributes.name,
      accountsBroker
    );
  }

  public responseToBrokers(response: any): Array<Broker> {
    const brokersArray = response.data;
    const brokers: Broker[] = [];

    brokersArray.forEach(item => {
      let accountsBroker: Array<Account> = [];
      accountsBroker = this.accountService.getBrokerAccounts(item.relationships.accounts.data, response.included);

      const broker = new Broker(
        item.id,
        item.attributes.name,
        accountsBroker
      );
      brokers.push(broker);
    });

    return brokers;
  }
}
