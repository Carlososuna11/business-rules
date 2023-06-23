import IFunction from '../commands/functions/IFunction';
import IOperator from '../commands/operators/IOperator';
import IContext from '../commands/contexts/IContext';

/**
 * A constructor type for an object
 */
export type Constructor<T> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...args: any[]): T;
	readonly prototype: T;
};

/**
 * A map of function objects
 */
export type FunctionMap<T> = { [key: string]: Constructor<IFunction<T>> };

/**
 * A map of operator objects
 */
export type OperatorMap<T> = { [key: string]: Constructor<IOperator<T>> };

/**
 * A map of context objects
 */
export type ContextMap<T> = { [key: string]: Constructor<IContext<T>> };

/**
 * A data object for holding key-value pairs
 */
export type Data = {
	[key: string]: unknown | Data;
};

/**
 * Options for an expression object
 */
export type ExpressionOptions = {
	[key: string]: FunctionMap<unknown> | OperatorMap<unknown> | ContextMap<unknown>;
};

/**
 * An object representing the engine and its rules
 */
export type EngineObject = {
	name: string;
	description: string;
	rules: RuleObject[];
};

/**
 * An object representing a rule
 */
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

/**
 * An object representing the result of a rule being fired
 */
export type RuleResult = {
	name: string;
	fired: boolean;
	discarted: boolean;
	actions?: unknown[];
};

/**
 * An object representing the result of the engine's execution
 */
export type EngineResult = {
	elapsed: number;
	fired: RuleResult[];
	context: Data;
};

/**
 * The available logging levels
 */
export type LoggerLevels = 'debug' | 'error' | 'warn' | 'info';

/**
 * An object representing logging methods
 */
export type LoggerMethods = {
	[key in LoggerLevels]: CallableFunction;
};

/**
 * The available conflict resolution strategies
 */
export type ConflictResolutionStrategies = 'specificity' | 'priority' | 'order';

/**
 * Options for a logger object
 */
export type LoggerOptions = {
	filter?: { error: boolean; debug: boolean; warn: boolean; info: boolean };
	delegate?: CallableFunction;
};

/**
 * Options for a delegator object
 */
export type DelegatorOptions = {
	preAction?: (...args: unknown[]) => unknown;
	condition?: (...args: unknown[]) => unknown;
	postAction?: (...args: unknown[]) => unknown;
};

/**
 * Options for the typeGuards function
 */
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
