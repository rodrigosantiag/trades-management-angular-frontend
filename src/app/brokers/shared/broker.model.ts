import {Account} from '../../accounts/shared/account.model';

export class Broker {
  public constructor(
    public id: number,
    public name: string,
    public accounts: Array<Account> = []
  ) {}
}
