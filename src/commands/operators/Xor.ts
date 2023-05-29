import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';

export default class Xor implements IOperator<boolean> {
	id = 'xor';
	symbol = '^';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	constructor(private readonly operands: (ICommand<boolean> | boolean)[]) {}

	private validateValue(value: boolean, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}

	execute(): boolean {
		let count = 0;
		for (let i = 0; i < this.operands.length; i++) {
			const operand = this.operands[i];
			const toEvaluate = isCommand(operand) ? operand.execute() : operand;
			this.validateValue(toEvaluate, `operands[${i}]`);
			if (toEvaluate) {
				count++;
			}
		}
		return count === 1;
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
