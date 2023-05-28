import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Substraction implements IOperator<number> {
	id = 'substraction';
	symbol = '-';

	private typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	left: number | string | ICommand<number | string>;
	right: number | string | ICommand<number | string>;

	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}


	private validateValue(value: number | string, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}

	execute(): number {
		const rightOperand = isCommand(this.right) ? this.right.execute() : this.right;
		this.validateValue(rightOperand, 'rightOperand');

		const leftOperand = isCommand(this.left) ? this.left.execute() : this.left;
		this.validateValue(leftOperand, 'leftOperand');

		return Number(leftOperand) - Number(rightOperand);
	}

	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
