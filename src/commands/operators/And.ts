import IOperator from './IOperator';
import ICommand from '../ICommand';
import { TypeGuard } from '../../utils';

export default class And implements IOperator<boolean> {
	id = 'and';
	symbol = '&&';

	typeGuard: TypeGuard = new TypeGuard(['boolean']);

	operators: (ICommand<boolean> | boolean)[];
	constructor(...operators: (ICommand<boolean> | boolean)[]) {
		this.operators = operators;
	}

	execute(): boolean {
		for (let i = 0; i < this.operators.length; i++) {
			const operand = this.operators[i];
			const toEvaluate = typeof operand === 'boolean' ? operand : operand.execute();
			this.typeGuard.evaluate(toEvaluate, this.id, `operand[${i}]`);
			if (!toEvaluate) {
				return false;
			}
		}

		return true;
	}

	toString(): string {
		const str = this.operators
			.map((operator) => {
				return typeof operator === 'boolean' ? operator : operator.toString();
			})
			.join(` ${this.symbol} `);
		return `(${str})`;
	}
}
