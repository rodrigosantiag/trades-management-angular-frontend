export class Account {
  public constructor(
    public id: number,
    public type_account: string,
    public currency: string,
    public initial_balance: number,
    public current_balance: number,
    public broker_id: number,
  ) {}
}
