import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Equal<T> implements IOperator<boolean> {
	symbol = '==';
	id = 'equal';

	left: T | ICommand<T>;
	right: T | ICommand<T>;
	constructor(left: T | ICommand<T>, right: T | ICommand<T>) {
		this.left = left;
		this.right = right;
	}
	execute(): boolean {
		const leftOperand = isCommand(this.left) ? this.left.execute() : this.left;
		const rightOperand = isCommand(this.right) ? this.right.execute() : this.right;

		return leftOperand === rightOperand;
	}
}
