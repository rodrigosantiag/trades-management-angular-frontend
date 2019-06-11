import {Broker} from '../../brokers/shared/broker.model';

export class Account {
  public constructor(
    public id: number,
    public type_account: string,
    public currency: string,
    public initial_balance: number,
    public current_balance: number,
    public broker_id: number,
    public broker?: Broker
  ) {
  }

  public getAccountType(): string {
    return this.type_account === 'D' ? 'Demo Account' : 'Real Account';
  }
}
