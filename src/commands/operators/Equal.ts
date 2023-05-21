import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Equal<T> implements IOperator<boolean> {
	symbol = '==';
	id = 'equal';

	left: boolean | ICommand<boolean>;
	right: boolean | ICommand<boolean>;
	constructor(left: boolean | ICommand<boolean>, right: boolean | ICommand<boolean>) {
		this.left = left;
		this.right = right;
	}
	execute(): boolean {
		const leftOperand = typeof this.left === 'boolean' ? this.left : this.left.execute();
		const rightOperand = typeof this.right === 'boolean' ? this.right : this.right.execute();

		return leftOperand === rightOperand;
	}
}
