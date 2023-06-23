import { Constructor } from '../../types';
import IOperator from './IOperator';
import And from './And';
import Or from './Or';
import Equal from './Equal';
import GreaterThan from './GreaterThan';
import Addition from './Addition';
import Divide from './Divide';
import Exponentiation from './Exponentiation';
import GreatherEqualThan from './GreaterEqualThan';
import IsNull from './IsNull';
import LessEqualThan from './LessEqualThan';
import LessThan from './LessThan';
import Multiply from './Multiply';
import Not from './Not';
import NotEqual from './NotEqual';
import Remainder from './Remainder';
import Root from './Root';
import Xor from './Xor';
import Contain from './Contain';
import In from './In';
import Between from './Between';
import Substraction from './Substraction';
import { BusinessRulesException } from '../../exceptions';
// Operators hashMap
const operators: { [key: string]: Constructor<IOperator<unknown>> } = {};

function getOperators(): {
	[key: string]: Constructor<IOperator<unknown>>;
} {
	return operators;
}

function registerOperator(id: string, operator: Constructor<IOperator<unknown>>): void {
	if (operators[id]) {
		throw new BusinessRulesException(`Operator with id ${id} already registered.`);
	}
	operators[id] = operator;
}

// Todo: register operators
registerOperator('additon', Addition);
registerOperator('and', And);
registerOperator('between', Between);
registerOperator('contain', Contain);
registerOperator('divide', Divide);
registerOperator('equal', Equal);
registerOperator('exponentiation', Exponentiation);
registerOperator('greaterEqualThan', GreatherEqualThan);
registerOperator('greaterThan', GreaterThan);
registerOperator('in', In);
registerOperator('isNull', IsNull);
registerOperator('lessEqualThan', LessEqualThan);
registerOperator('lessThan', LessThan);
registerOperator('multiply', Multiply);
registerOperator('not', Not);
registerOperator('notEqual', NotEqual);
registerOperator('or', Or);
registerOperator('remainder', Remainder);
registerOperator('root', Root);
registerOperator('substraction', Substraction);
registerOperator('xor', Xor);

export { IOperator, getOperators, registerOperator };
