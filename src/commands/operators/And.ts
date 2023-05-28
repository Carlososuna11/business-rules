import IOperator from './IOperator';
import ICommand from '../ICommand';
import { TypeGuard } from '../../utils';

export default class And implements IOperator<boolean> {
	id = 'and';
	symbol = '&&';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	operands: (ICommand<boolean> | boolean)[];
	constructor(...operands: (ICommand<boolean> | boolean)[]) {
		this.operands = operands;
	}

	private validateOperand(value: boolean, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}

	execute(): boolean {
		for (let i = 0; i < this.operands.length; i++) {
			const operand = this.operands[i];
			const toEvaluate = typeof operand === 'boolean' ? operand : operand.execute();
			this.validateOperand(toEvaluate, `operands[${i}]`);
			if (!toEvaluate) {
				return false;
			}
		}

		return true;
	}

	toString(): string {
		const str = this.operands
			.map((operand) => {
				return typeof operand === 'boolean' ? operand : operand.toString();
			})
			.join(` ${this.symbol} `);
		return `(${str})`;
	}
}
