import ICommand from '../ICommand';
import IOperator from './IOperator';

export default class LessEqualThan implements IOperator<boolean> {
	symbol = '<=';
	id = 'lessEqualThan';

	left: number | ICommand<number>;
	right: number | ICommand<number>;
	constructor(left: number | ICommand<number>, right: number | ICommand<number>) {
		this.left = left;
		this.right = right;
	}
	execute(): boolean {
		const leftOperand = typeof this.left === 'number' ? this.left : this.left.execute();
		const rightOperand = typeof this.right === 'number' ? this.right : this.right.execute();

		return leftOperand <= rightOperand;
	}
}
