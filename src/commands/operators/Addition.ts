import IOperator from './IOperator';
import ICommand from '../ICommand';

export default class Addition implements IOperator<number> {
	id = 'addition';
	symbol = '+';

	left: number | ICommand<number>;
	right: number | ICommand<number>;

	constructor(left: number | ICommand<number>, right: number | ICommand<number>) {
		this.left = left;
		this.right = right;
	}
	execute(): number {
		const rightOperand = typeof this.right === 'number' ? this.right : this.right.execute();
		const leftOperand = typeof this.left === 'number' ? this.left : this.left.execute();

		return leftOperand + rightOperand;
	}
}
