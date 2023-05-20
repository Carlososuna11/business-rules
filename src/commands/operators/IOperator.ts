import ICommand from '../ICommand';

export default interface IOperator<T> extends ICommand<T> {
  symbol: string;
}
