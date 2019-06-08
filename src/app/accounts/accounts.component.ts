import {Component, OnInit} from '@angular/core';
import {Account} from './shared/account.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  public accounts: Array<Account>;

  public constructor() {
  }

  ngOnInit() {
  }

}
