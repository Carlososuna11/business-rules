import IOperator from './IOperator';

export default class And implements IOperator<boolean> {
  operators: (boolean | IOperator<boolean>)[];
  constructor(...operators: (boolean | IOperator<boolean>)[]) {
    this.operators = operators;
  }

  execute(): boolean {
    return this.operators.every((operator) => {
      return typeof operator === 'boolean' ? operator : operator.execute();
    });
  }
}
