import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';

export default class Or implements IOperator<boolean> {
	id = 'or';
	symbol = '||';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);
	operands: (ICommand<boolean> | boolean)[];
	constructor(...operands: (ICommand<boolean> | boolean)[]) {
		this.operands = operands;
	}

	private validateValue(value: boolean, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}


	execute(): boolean {
		for (let i = 0; i < this.operands.length; i++) {
			const operand = this.operands[i];
			const toEvaluate = isCommand(operand) ? operand.execute() : operand;
			this.validateValue(toEvaluate, `operands[${i}]`);
			if (toEvaluate) {
				return true;
			}
		}

		return false;
	}

	toString(): string {
		const str = this.operands
			.map((operator) => {
				return typeof operator === 'boolean' ? operator : operator.toString();
			})
			.join(` ${this.symbol} `);
		return `(${str})`;
	}
}
