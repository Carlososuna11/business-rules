import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Not implements IOperator<boolean> {
	symbol = '!';
	id = 'not';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);
	constructor(public operand: boolean | ICommand<boolean>) {}

	private async validateValue(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		const operand = isCommand(this.operand) ? await this.operand.execute(context) : this.operand;
		await this.validateValue(operand, 'operand');

		return !operand;
	}

	public toString(): string {
		return `${this.symbol}(${this.operand.toString()})`;
	}
}
