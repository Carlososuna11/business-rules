import ICommand from '../ICommand';
import IOperator from './IOperator';

export default class Substraction implements IOperator<number> {
	id = 'substraction';
	symbol = '-';

	left: number | string | ICommand<number | string>;
	right: number | string | ICommand<number | string>;

	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}
	execute(): number {
		const rightOperand =
			typeof this.right === 'number' || typeof this.right === 'string' ? this.right : this.right.execute();
		const leftOperand =
			typeof this.left === 'number' || typeof this.left === 'string' ? this.left : this.left.execute();

		return Number(leftOperand) - Number(rightOperand);
	}

	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
