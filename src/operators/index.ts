import { Constructor } from '../types';
import IOperator from './IOperator';
import And from './And';
import Or from './Or';
import Not from './Not';
import Xor from './Xor';
import Equal from './Equal';
import GreatherTham from './GreatherThan';
import LessThan from './LessThan';
import Contains from './Contains';
import Substract from './Substract';
import Sum from './Sum';
import GreatherEqualThan from './GreatherEqualThan';
import LessEqualThan from './LessEqualThan';
import Other from './Other';
import Multiply from './Multiply';
import Divide from './Divide';
import Remainder from './Remainder';
import Root from './Root';
import Exponentiation from './Exponentiation';
import IsNull from './IsNull';

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
registerOperator('equal')(Equal);
registerOperator('gretaterThan')(GreatherTham);
registerOperator('lessThan')(LessThan);
registerOperator('contains')(Contains);
registerOperator('substract')(Substract);
registerOperator('sum')(Sum);
registerOperator('greatherEqualThan')(GreatherEqualThan);
registerOperator('lessEqualThan')(LessEqualThan);
registerOperator('other')(Other);
registerOperator('multiply')(Multiply);
registerOperator('divide')(Divide);
registerOperator('remainder')(Remainder);
registerOperator('root')(Root);
registerOperator('exponentiation')(Exponentiation);
registerOperator('isNull')(IsNull);
