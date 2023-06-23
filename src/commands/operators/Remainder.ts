import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

/**
 * Represents the Remainder Operator.
 * @implements {IOperator<number>}
 * @class
 */
export default class Remainder implements IOperator<number> {
	/**
	 * The identifier of the operator.
	 * @public
	 * @type {string}
	 */
	id = 'remainder';

	/**
	 * The symbol of the operator.
	 * @public
	 * @type {string}
	 */
	symbol = '%';

	/**
	 * A TypeGuard instance to check the value types.
	 * @private
	 * @type {TypeGuard}
	 */
	private typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * The left operand of the operator.
	 * @public
	 * @type {number | string | ICommand<number | string>}
	 */
	left: number | string | ICommand<number | string>;

	/**
	 * The right operand of the operator.
	 * @public
	 * @type {number | string | ICommand<number | string>}
	 */
	right: number | string | ICommand<number | string>;

	/**
	 * Creates an instance of Remainder.
	 * @param {number | string | ICommand<number | string>} left - The left operand of the operator.
	 * @param {number | string | ICommand<number | string>} right - The right operand of the operator.
	 */
	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validates that the given value is a number or string.
	 * @private
	 * @param {number | string} value - The value to be validated.
	 * @param {string} operandName - The name of the operand being validated.
	 * @returns {Promise<void>}
	 * @throws {ValueException} If the value is not a number or string type.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Remainder operation and returns the result.
	 * @public
	 * @async
	 * @param {AbstractContextData} context - The context data for the execution.
	 * @returns {Promise<number>} The result of the Remainder operation.
	 * @throws {ValueException} If the operands are not valid numbers.
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

		return Number(leftOperand) % Number(rightOperand);
	}

	/**
	 * Returns the string representation of the Remainder operation.
	 * @public
	 * @returns {string} The string representation of the Remainder operation.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
