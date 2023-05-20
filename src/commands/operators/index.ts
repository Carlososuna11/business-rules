import { Constructor } from '../../types';
import IOperator from './IOperator';
import And from './And';
import Or from './Or';
import Equal from './Equal';
import GreaterThan from './GreaterThan';
// Operators hashMap
const operators: { [key: string]: Constructor<IOperator<unknown>> } = {};

function getOperators(): {
	[key: string]: Constructor<IOperator<unknown>>;
} {
	return operators;
}

function registerOperator(id: string, operator: Constructor<IOperator<unknown>>): void {
	if (operators[id]) {
		throw new Error(`Operator with id ${id} already registered.`);
	}
	operators[id] = operator;
}

// Todo: register operators
registerOperator('and', And);
registerOperator('or', Or);
registerOperator('equal', Equal);
registerOperator('greaterThan', GreaterThan);

export { IOperator, getOperators, registerOperator };
