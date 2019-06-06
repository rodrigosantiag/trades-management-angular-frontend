export class Account {
  public constructor(
    public id: number,
    public typeAccount: string,
    public currency: string,
    public initialBalance: number = 0,
    public currentBalance: number = 0,
    public brokerId: number,
  ) {}
}
