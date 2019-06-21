export class Trade {
  public constructor(
    public id: number,
    public value: number,
    public profit: number,
    public result: boolean,
    public accountId: number,
    public account: Account,
    public resultBalance?: number,
    public typeTrade?: string
  ) {
  }
}
