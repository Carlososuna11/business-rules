import ICommand from '../ICommand';
import IOperator from './IOperator';
import { TypeGuard } from '../../utils';

export default class GreaterThan implements IOperator<boolean> {
	id = 'greaterThan';
	symbol = '>';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	left: number | string | ICommand<number | string>;
	right: number | string | ICommand<number | string>;

	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}
	execute(): boolean {
		const rightOperand =
			typeof this.right === 'number' || typeof this.right === 'string' ? this.right : this.right.execute();

		this.typeGuard.evaluate(rightOperand, this.id, 'rightOperand');

		const leftOperand =
			typeof this.left === 'number' || typeof this.left === 'string' ? this.left : this.left.execute();

		this.typeGuard.evaluate(leftOperand, this.id, 'leftOperand');

		return Number(leftOperand) > Number(rightOperand);
	}

	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
