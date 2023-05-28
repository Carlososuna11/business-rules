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
	execute(): boolean {
		const leftOperand = isCommand(this.left) ? this.left.execute() : this.left;
		const rightOperand = isCommand(this.right) ? this.right.execute() : this.right;

		return leftOperand !== rightOperand;
	}

	toString(): string {
		return `${isCommand(this.left) ? this.left.toString() : this.left} ${this.symbol} ${
			isCommand(this.right) ? this.right.toString() : this.right
		}`;
	}
}
