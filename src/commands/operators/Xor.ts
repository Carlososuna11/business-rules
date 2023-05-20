import IOperator from './IOperator';
import { registerOperator } from '.';
import ICommand from '../ICommand';

@registerOperator('xor')
export default class Xor implements IOperator<boolean> {
	id = 'xor';
	symbol = '^';

	operators: (ICommand<boolean> | boolean)[];
	constructor(...operators: (ICommand<boolean> | boolean)[]) {
		this.operators = operators;
	}

	execute(): boolean {
		const booleanOperators = this.operators.filter((operator) => typeof operator === 'boolean') as boolean[];
		const operatorOperators = this.operators.filter((operator) => typeof operator === 'object') as ICommand<boolean>[];

		// if (booleanOperators.length === this.operators.length || operatorOperators.length === this.operators.length) {
		// 	throw new Error('Xor operator needs at least two operands');
		// }

		let result = false;
		for (let i = 0; i < booleanOperators.length; i++) {
			result = result !== booleanOperators[i];
		}
		for (let i = 0; i < operatorOperators.length; i++) {
			result = result !== operatorOperators[i].execute();
		}

		return result;
	}
}
