import IFunction from '../functions/IFunction';
import IOperator from '../operators/IOperator';
import IData from '../data/IData';

export type Constructor<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  readonly prototype: T;
};

export type FunctionMap<T> = { [key: string]: Constructor<IFunction<T>> };
export type OperatorMap<T> = { [key: string]: Constructor<IOperator<T>> };
export type DataMap<T> = { [key: string]: Constructor<IData<T>> };

export type Data = {
  [key: string]: unknown | Data;
};
export type ExpressionOptions = {
  [key: string]: FunctionMap<unknown> | OperatorMap<unknown> | DataMap<unknown>;
};
