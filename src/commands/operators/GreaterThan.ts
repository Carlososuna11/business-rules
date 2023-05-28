import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';
import { TypeGuard } from '../../utils';

export default class GreaterThan implements IOperator<boolean> {
	id = 'greaterThan';
	symbol = '>';

	private typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	left: number | string | ICommand<number | string>;
	right: number | string | ICommand<number | string>;

	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	private validateOperand(value: number | string, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}

	execute(): boolean {
		const rightOperand = isCommand(this.right) ? this.right.execute() : this.right;
		this.validateOperand(rightOperand, 'right');

		const leftOperand = isCommand(this.left) ? this.left.execute() : this.left;
		this.validateOperand(leftOperand, 'left');

		return Number(leftOperand) > Number(rightOperand);
	}

	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
