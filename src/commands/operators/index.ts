import { Constructor } from '../../types';
import IOperator from './IOperator';

// Operators hashMap
const operators: { [key: string]: Constructor<IOperator<unknown>> } = {};

function getOperators(): {
	[key: string]: Constructor<IOperator<unknown>>;
} {
	return operators;
}

function registerOperator<T extends Constructor<IOperator<unknown>>>(code: string) {
	return function (ctor: T): T {
		if (operators[code]) {
			throw new Error(`Operator with code ${code} already registered.`);
		}
		operators[code] = ctor;
		return ctor;
	};
}

export { IOperator, getOperators, registerOperator };
