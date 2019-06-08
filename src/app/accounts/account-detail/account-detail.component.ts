import {Component, OnInit} from '@angular/core';
import * as currencies from 'currency-codes';
import {Broker} from '../../brokers/shared/broker.model';
import {BrokerService} from '../../brokers/shared/broker.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  public currencies: any;
  public brokers: Array<Broker>;

  constructor(private brokerService: BrokerService) {
    this.brokerService.getAll()
      .subscribe(
        brokers => this.brokers = brokers
      );
  }

  ngOnInit() {
    this.currencies = currencies.codes().map((currency) => {
      return currencies.code(currency);
    });
  }


}
