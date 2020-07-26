import {Account} from '../../accounts/shared/account.model';
import {Strategy} from '../../strategies/shared/strategy.model';

export class Trade {
  public constructor(
    public id: number,
    public value: number,
    public profit: number,
    public result: boolean,
    public accountId: number,
    public strategyId?: number,
    public createdDateFormatted?: string,
    public typeTrade?: string,
    public resultBalance?: number,
    public account?: Account,
    public strategy?: Strategy
  ) {
  }
}
