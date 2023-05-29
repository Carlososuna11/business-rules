import IOperator from './IOperator';
import ICommand from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class Or implements IOperator<boolean> {
	id = 'or';
	symbol = '||';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	constructor(public operands: (ICommand<boolean> | boolean)[]) {}

	private async validateOperand(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	public async execute(context: AbstractContextData): Promise<boolean> {
		for (let i = 0; i < this.operands.length; i++) {
			const operand = this.operands[i];
			const toEvaluate = typeof operand === 'boolean' ? operand : await operand.execute(context);
			await this.validateOperand(toEvaluate, `operands[${i}]`);
			if (toEvaluate) {
				return true;
			}
		}

		return false;
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
