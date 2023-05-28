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

export type RuleObject = {
	name: string;
	condition: Data;
	description?: string;
	final?: boolean;
	priority?: number;
	activationGroup?: string;
	preActions?: Data[];
	postActions?: Data[];
};

export type RuleResult = {
	name: string;
	fired: boolean;
	discarted: boolean;
	actions?: unknown[];
};

export type EngineResult = {
	elapsed: number;
	fired: RuleResult[];
	context: Data;
};

export type LoggerLevels = 'debug' | 'error' | 'warn' | 'info';

export type LoggerMethods = {
	[key in LoggerLevels]: CallableFunction;
};

export type ConflictResolutionStrategies = 'specificity' | 'priority' | 'order';

export type LoggerOptions = {
	filter?: { error: boolean; debug: boolean; warn: boolean; info: boolean };
	delegate?: CallableFunction;
};

export type DelegatorOptions = {
	preAction?: (...args: unknown[]) => unknown;
	condition?: (...args: unknown[]) => unknown;
	postAction?: (...args: unknown[]) => unknown;
};

// list of available options for the typeGuards function
export type TypeGuardsOptions =
	| 'string'
	| 'number'
	| 'boolean'
	| 'object'
	| 'array'
	| 'function'
	| 'null'
	| 'undefined'
	| 'symbol'
	| 'date'
	| 'command'
	| 'map'
	| 'set';
