import ICommand from '../ICommand';
import IOperator from './IOperator';

export default class GreaterEqualThan implements IOperator<boolean> {
	id = 'greaterEqualThan';
	symbol = '>=';

	left: number | string | ICommand<number | string>;
	right: number | string | ICommand<number | string>;

	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}
	execute(): boolean {
		const rightOperand =
			typeof this.right === 'number' || typeof this.right === 'string' ? this.right : this.right.execute();
		const leftOperand =
			typeof this.left === 'number' || typeof this.left === 'string' ? this.left : this.left.execute();

		return Number(leftOperand) >= Number(rightOperand);
	}
}