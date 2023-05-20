import ICommand from '../ICommand';
import IOperator from './IOperator';

export default class Multiply implements IOperator<number> {
	symbol = '*';
	id = 'multiply';

	left: number | ICommand<number>;
	right: number | ICommand<number>;
	constructor(left: number | ICommand<number>, right: number | ICommand<number>) {
		this.left = left;
		this.right = right;
	}
	execute(): number {
		const leftOperand = typeof this.left === 'number' ? this.left : this.left.execute();
		const rightOperand = typeof this.right === 'number' ? this.right : this.right.execute();
		return leftOperand * rightOperand;
	}
}
