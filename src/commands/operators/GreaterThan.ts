/**
 * Represents the ">" (greater than) operator between two operands of type number, string, or date.
 */
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class GreaterThan implements IOperator<boolean> {
	/**
	 * The operator id.
	 */
	id = 'greaterThan';

	/**
	 * The symbol for the operator.
	 */
	symbol = '>';

	/**
	 * The type guard for the operands.
	 */
	private typeGuard: TypeGuard = new TypeGuard(['number', 'string', 'date']);

	/**
	 * The left operand of the operator.
	 */
	left: number | string | Date | ICommand<number | string | Date>;

	/**
	 * The right operand of the operator.
	 */
	right: number | string | Date | ICommand<number | string | Date>;

	/**
	 * Creates a new instance of GreaterThan with provide operands.
	 *
	 * @param left - The left operand of the operator.
	 * @param right - The right operand of the operator.
	 */
	constructor(
		left: number | string | Date | ICommand<number | string | Date>,
		right: number | string | Date | ICommand<number | string | Date>
	) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validates that an operand is of type number, string, or date.
	 *
	 * @param value - The operand to validate.
	 * @param operandName - The name of the operand to validate.
	 */
	private async validateOperand(value: number | string | Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the ">" (greater than) operator between the left and right operands.
	 *
	 * @param context - The context data.
	 *
	 * @returns The result of the ">" (greater than) operation.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateOperand(rightOperand, 'right');

		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateOperand(leftOperand, 'left');

		return Number(leftOperand) > Number(rightOperand);
	}

	/**
	 * Returns a string representation of the operator.
	 *
	 * @returns The string representation of the operator.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
