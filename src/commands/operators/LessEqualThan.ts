import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';
export default class LessEqualThan implements IOperator<boolean> {
	id = 'lessEqualThan';
	symbol = '<=';

	private typeGuard: TypeGuard = new TypeGuard(['number', 'string', 'date']);
	left: number | string | Date | ICommand<number | string | Date>;
	right: number | string | Date | ICommand<number | string | Date>;

	constructor(
		left: number | string | Date | ICommand<number | string | Date>,
		right: number | string | Date | ICommand<number | string | Date>
	) {
		this.left = left;
		this.right = right;
	}

	private async validateValue(value: number | string | Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateValue(rightOperand, 'rightOperand');

		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateValue(leftOperand, 'leftOperand');

		return Number(leftOperand) <= Number(rightOperand);
	}

	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
