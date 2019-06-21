import {Broker} from '../../brokers/shared/broker.model';
import {Trade} from '../../trades/shared/trade.model';

export class Account {
  public constructor(
    public id: number,
    public typeAccount: string,
    public currency: string,
    public initialBalance: number,
    public currentBalance: number,
    public brokerId: number,
    public broker?: Broker,
    public trades?: Array<Trade>
  ) {
  }

  public getAccountType(): string {
    return this.typeAccount === 'D' ? 'Demo Account' : 'Real Account';
  }
}
