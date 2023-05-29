import IOperator from './IOperator';
import ICommand from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';
export default class Addition implements IOperator<number | string> {
	id = 'addition';
	symbol = '+';

	private typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	left: number | string | ICommand<number | string>;
	right: number | string | ICommand<number | string>;

	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const rightOperand =
			typeof this.right === 'number' || typeof this.right === 'string' ? this.right : await this.right.execute(context);
		await this.validateOperand(rightOperand, 'right');
		const leftOperand =
			typeof this.left === 'number' || typeof this.left === 'string' ? this.left : await this.left.execute(context);
		await this.validateOperand(leftOperand, 'left');

		return Number(leftOperand) + Number(rightOperand);
	}

	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
