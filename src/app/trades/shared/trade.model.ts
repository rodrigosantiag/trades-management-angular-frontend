import {Account} from '../../accounts/shared/account.model';

export class Trade {
  public constructor(
    public id: number,
    public value: number,
    public profit: number,
    public result: boolean,
    public accountId: number,
    public createdDateFormatted?: string,
    public typeTrade?: string,
    public resultBalance?: number,
    public account?: Account
  ) {
  }
}
