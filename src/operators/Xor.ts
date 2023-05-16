import IOperator from './IOperator';

export default class Xor implements IOperator<boolean> {
	operators: (IOperator<boolean> | boolean)[];
	constructor(...operators: (IOperator<boolean> | boolean)[]) {
		this.operators = operators;
	}

	execute(): boolean {
		const booleanOperators = this.operators.filter((operator) => typeof operator === 'boolean') as boolean[];
		const operatorOperators = this.operators.filter((operator) => typeof operator === 'object') as IOperator<boolean>[];

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
