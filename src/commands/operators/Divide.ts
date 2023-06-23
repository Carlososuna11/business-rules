/**
 * Divide operator implementation for numbers and strings.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Divide implements IOperator<number> {
	/**
	 * Unique identifier for the divide operator.
	 */
	id = 'divide';
	/**
	 * Symbol used for the divide operator.
	 */
	symbol = '/';

	/**
	 * TypeGuard used to validate the operands of the operator.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	/**
	 * Left operand of the divide operation.
	 */
	left: number | string | ICommand<number | string>;
	/**
	 * Right operand of the divide operation.
	 */
	right: number | string | ICommand<number | string>;

	/**
	 * Creates a new instance of the divide operator.
	 * @param left Left operand of the divide operation.
	 * @param right Right operand of the divide operation.
	 */
	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validates a value against the typeGuard.
	 * @param value Value to validate.
	 * @param operandName Name of the operand being validated.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the divide operation.
	 * @param context Context data used for command execution.
	 * @returns The result of the divide operation.
	 * @throws {ValueException} If any of the operands is not a valid number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateValue(rightOperand, 'rightOperand');

		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateValue(leftOperand, 'leftOperand');

		if (isNaN(Number(rightOperand))) {
			throw new ValueException(`On ${this.id}. The value '${rightOperand}' is not a valid number.`);
		}
		if (isNaN(Number(leftOperand))) {
			throw new ValueException(`On ${this.id}. The value '${leftOperand}' is not a valid number.`);
		}

		return Number(leftOperand) / Number(rightOperand);
	}

	/**
	 * Returns the string representation of the divide operation.
	 * @returns The string representation of the divide operation.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
