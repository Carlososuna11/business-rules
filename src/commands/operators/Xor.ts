import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class Xor implements IOperator<boolean> {
	id = 'xor';
	symbol = '^';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	constructor(private readonly operands: (ICommand<boolean> | boolean)[]) {}

	private async validateValue(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		let count = 0;
		for (let i = 0; i < this.operands.length; i++) {
			const operand = this.operands[i];
			const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
			await this.validateValue(toEvaluate, `operands[${i}]`);
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
