import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

/**
 * Class representing the substraction operator.
 * @implements {IOperator<number>}
 */
export default class Substraction implements IOperator<number> {
	/**
	 * The operator id.
	 * @type {string}
	 */
	id = 'substraction';
	/**
	 * The operator symbol.
	 * @type {string}
	 */
	symbol = '-';

	/**
	 * TypeGuard instance for validating operands.
	 * @type {TypeGuard}
	 * @private
	 */
	private typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * The left operand for the operation.
	 * @type {number | string | ICommand<number | string>}
	 */
	left: number | string | ICommand<number | string>;

	/**
	 * The right operand for the operation.
	 * @type {number | string | ICommand<number | string>}
	 */
	right: number | string | ICommand<number | string>;

	/**
	 * Create a substraction operator instance.
	 * @constructor
	 * @param {number | string | ICommand<number | string>} left The left operand for the operation.
	 * @param {number | string | ICommand<number | string>} right The right operand for the operation.
	 */
	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validate that the given value and type is valid for the operand.
	 * @param {number | string} value The value to validate.
	 * @param {string} operandName The name of the operand being validated.
	 * @returns {Promise<void>} Promise that resolves if the value is valid, otherwise rejects with an error message.
	 * @private
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Execute the substraction operation.
	 * @param {AbstractContextData} context The context data for the execution.
	 * @returns {Promise<number>} Promise that resolves with the result of the operation.
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

		return Number(leftOperand) - Number(rightOperand);
	}

	/**
	 * Get the string representation of the substraction operation.
	 * @returns {string} The string representation of the substraction operation.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
