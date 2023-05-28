import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Not implements IOperator<boolean> {
	symbol = '!';
	id = 'not';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);
	constructor(public operand: boolean | ICommand<boolean>) {}

	private validateValue(value: boolean, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}

	public execute(): boolean {
		const operand = isCommand(this.operand) ? this.operand.execute() : this.operand;
		this.validateValue(operand, 'operand');

		return !operand;
	}

	public toString(): string {
		return `${this.symbol}(${this.operand.toString()})`;
	}
}
