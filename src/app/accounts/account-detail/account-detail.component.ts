import {Component, OnInit} from '@angular/core';
import * as currencies from 'currency-codes';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  public currencies: any;

  constructor() {
  }

  ngOnInit() {
    this.currencies = currencies.codes().map((currency) => {
      return currencies.code(currency);
    });

    console.log(this.currencies);


  }


}
