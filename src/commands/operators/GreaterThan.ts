import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class GreaterThan implements IOperator<boolean> {
	id = 'greaterThan';
	symbol = '>';

	private typeGuard: TypeGuard = new TypeGuard(['number', 'string', 'date']);
	left: number | string  | Date| ICommand<number | string | Date>;
	right: number | string | Date | ICommand<number | string | Date>;

	constructor(left: number | string | Date | ICommand<number | string | Date>, right: number | string | Date | ICommand<number | string | Date>) {
		this.left = left;
		this.right = right;
	}

	private async validateOperand(value: number | string | Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {


		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateOperand(rightOperand, 'right');

		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateOperand(leftOperand, 'left');

		return Number(leftOperand) > Number(rightOperand);
	}

	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
