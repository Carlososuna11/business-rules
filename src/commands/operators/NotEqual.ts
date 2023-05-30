import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class NotEqual implements IOperator<boolean> {
	symbol = '!=';
	id = 'notEqual';

	left: unknown | ICommand<unknown>;
	right: unknown | ICommand<unknown>;
	constructor(left: unknown | ICommand<unknown>, right: unknown | ICommand<unknown>) {
		this.left = left;
		this.right = right;
	}
	async execute(context: AbstractContextData): Promise<boolean> {
		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;

		return leftOperand !== rightOperand;
	}

	toString(): string {
		return `${isCommand(this.left) ? this.left.toString() : this.left} ${this.symbol} ${
			isCommand(this.right) ? this.right.toString() : this.right
		}`;
	}
}
