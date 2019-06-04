export class AccountModel {
  public constructor(
    public id: number,
    public typeAccount: string,
    public currency: string,
    public initialBalance: number,
    public currentBalance: number
  ) {}
}
