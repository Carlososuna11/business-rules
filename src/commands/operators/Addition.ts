import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';
export default class Addition implements IOperator<number | string> {
	id = 'addition';
	symbol = '+';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	left: number | string | ICommand<number | string>;
	right: number | string | ICommand<number | string>;

	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateOperand(rightOperand, 'right');
		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateOperand(leftOperand, 'left');

		return Number(leftOperand) + Number(rightOperand);
	}

	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
