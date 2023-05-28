import IFunction from '../commands/functions/IFunction';
import IOperator from '../commands/operators/IOperator';
import IContext from '../commands/contexts/IContext';

export type Constructor<T> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...args: any[]): T;
	readonly prototype: T;
};

export type FunctionMap<T> = { [key: string]: Constructor<IFunction<T>> };
export type OperatorMap<T> = { [key: string]: Constructor<IOperator<T>> };
export type ContextMap<T> = { [key: string]: Constructor<IContext<T>> };

export type Data = {
	[key: string]: unknown | Data;
};
export type ExpressionOptions = {
	[key: string]: FunctionMap<unknown> | OperatorMap<unknown> | ContextMap<unknown>;
};
