/**
 * Represents a less than operator that can compare numbers, strings, and dates.
 * @implements {IOperator<boolean>}
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class LessThan implements IOperator<boolean> {
	/**
	 * The ID of the less than operator.
	 * @type {string}
	 */
	id = 'lessThan';
	/**
	 * The symbol of the less than operator.
	 * @type {string}
	 */
	symbol = '<';

	/**
	 * The type guard instance.
	 * @type {TypeGuard}
	 * @private
	 */
	private typeGuard: TypeGuard = new TypeGuard(['number', 'string', 'date']);

	/**
	 * The left operand of the less than operator.
	 * @type {number | string | Date | ICommand<number | string | Date>}
	 */
	left: number | string | Date | ICommand<number | string | Date>;
	/**
	 * The right operand of the less than operator.
	 * @type {number | string | Date | ICommand<number | string | Date>}
	 */
	right: number | string | Date | ICommand<number | string | Date>;

	/**
	 * Creates an instance of LessThan operator.
	 * @param {number | string | Date | ICommand<number | string | Date>} left The left operand of the operator.
	 * @param {number | string | Date | ICommand<number | string | Date>} right The right operand of the operator.
	 */
	constructor(
		left: number | string | Date | ICommand<number | string | Date>,
		right: number | string | Date | ICommand<number | string | Date>
	) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validates the value of the operand.
	 * @param {number | string | Date} value The value of the operand.
	 * @param {string} operandName The name of the operand.
	 * @returns {Promise<void>}
	 * @private
	 */
	private async validateValue(value: number | string | Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the less than operator in the given context.
	 * @param {AbstractContextData} context The context in which to execute the operator.
	 * @returns {Promise<boolean>} A promise that resolves to the result of the operator execution.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateValue(rightOperand, 'rightOperand');

		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateValue(leftOperand, 'leftOperand');

		return Number(leftOperand) < Number(rightOperand);
	}

	/**
	 * Returns a string representation of the less than operator.
	 * @returns {string} A string representation of the less than operator.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
