import { Constructor } from '../types';
import IOperator from './IOperator';
import And from './And';
import Or from './Or';
import Not from './Not';
import Xor from './Xor';
import Eq from './Equal';
import GT from './GreatherThan';
import LT from './LessThan';
import Con from './Contains';
import Sub from './Substract';
import Sum from './Sum';
import GTE from './GreatherThanOrEqual';
import LTE from './LessThanOrEqual';

// Operators hashMap
const operators: { [key: string]: Constructor<IOperator<unknown>> } = {};

export function getOperators(): {
	[key: string]: Constructor<IOperator<unknown>>;
} {
	return operators;
}

export function registerOperator<T extends Constructor<IOperator<unknown>>>(code: string) {
	return function (ctor: T): T {
		if (operators[code]) {
			throw new Error(`Operator with code ${code} already registered.`);
		}
		operators[code] = ctor;
		return ctor;
	};
}

// Register operators
registerOperator('and')(And);
registerOperator('or')(Or);
registerOperator('not')(Not);
registerOperator('xor')(Xor);
registerOperator('equal')(Eq);
registerOperator('gretaterThan')(GT);
registerOperator('lessThan')(LT);
registerOperator('contains')(Con);
registerOperator('substract')(Sub);
registerOperator('sum')(Sum);
registerOperator('greaterThanOrEqual')(GTE);
registerOperator('lessThanOrEqual')(LTE);
