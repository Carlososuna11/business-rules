/**
 * Represents the multiplication operator for numbers or strings.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Multiply implements IOperator<number> {
	/**
	 * The unique identifier of the operator.
	 */
	id = 'multiply';
	/**
	 * The symbol used to represent the operation.
	 */
	symbol = '*';

	/**
	 * A TypeGuard instance used to check the types of operands.
	 */
	private typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	/**
	 * The left operand which can be a number, string, or a command that returns a number or string.
	 */
	left: number | string | ICommand<number | string>;
	/**
	 * The right operand which can be a number, string, or a command that returns a number or string.
	 */
	right: number | string | ICommand<number | string>;

	/**
	 * Creates a new Multiply instance.
	 * @param left The left operand which can be a number, string, or a command that returns a number or string.
	 * @param right The right operand which can be a number, string, or a command that returns a number or string.
	 */
	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validates the type of the given operand value.
	 * @param value The value to validate.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the multiplication operation on the operands.
	 * @param context The context object.
	 * @returns The result of the multiplication operation.
	 * @throws ValueException If one of the operands is not a valid number.
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

		return Number(leftOperand) * Number(rightOperand);
	}

	/**
	 * Returns the string representation of the multiplication operation.
	 * @returns The string representation of the multiplication operation.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
