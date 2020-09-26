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
    public strategy?: Strategy
  ) {
  }

  // public setStrategy() {
  //
  // }

  public setStrategyFromIncluded(responseIncluded: Array<any>) {
    if (responseIncluded !== undefined) {
      responseIncluded.filter(k => {
        if (k.type === 'strategies' && +k.id === +this.strategyId) {
          this.strategy = new Strategy(
            k.id,
            k.attributes.name
          );
        }
      });
    }
  }
}
