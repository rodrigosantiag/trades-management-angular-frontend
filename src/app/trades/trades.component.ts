import {Component, OnInit} from '@angular/core';
import {getCurrencySymbol} from '@angular/common';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  public currencyCode: string;

  constructor() {
    this.currencyCode = getCurrencySymbol('USD', 'wide');
  }

  ngOnInit() {
  }

}
