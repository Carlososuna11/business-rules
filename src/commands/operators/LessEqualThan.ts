/**
 * Represents the LessEqualThan operator that checks if the left operand is less than or equal to the right operand.
 * @implements {IOperator<boolean>}
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class LessEqualThan implements IOperator<boolean> {
	/**
	 * The id of the LessEqualThan operator.
	 */
	id = 'lessEqualThan';
	/**
	 * The symbol used to represent the LessEqualThan operator.
	 */
	symbol = '<=';
	/**
	 * The left operand of the LessEqualThan operator.
	 */
	private left: number | string | Date | ICommand<number | string | Date>;
	/**
	 * The right operand of the LessEqualThan operator.
	 */
	private right: number | string | Date | ICommand<number | string | Date>;
	/**
	 * The TypeGuard instance used to validate the type of the operands.
	 */
	private typeGuard: TypeGuard = new TypeGuard(['number', 'string', 'date']);

	/**
	 * Creates an instance of LessEqualThan.
	 * @param {(number|string|Date|ICommand<number|string|Date>)} left The left operand of the LessEqualThan operator.
	 * @param {(number|string|Date|ICommand<number|string|Date>)} right The right operand of the LessEqualThan operator.
	 */
	constructor(
		left: number | string | Date | ICommand<number | string | Date>,
		right: number | string | Date | ICommand<number | string | Date>
	) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Asynchronously validates the value of an operand.
	 * @param {(number|string|Date)} value The value of the operand to be validated.
	 * @param {string} operandName The name of the operand being validated.
	 * @returns {Promise<void>}
	 */
	private async validateValue(value: number | string | Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Asynchronously executes the LessEqualThan operator.
	 * @param {AbstractContextData} context The context in which the LessEqualThan operator is being executed.
	 * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating if the left operand is less than or equal to the right operand.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateValue(rightOperand, 'rightOperand');

		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateValue(leftOperand, 'leftOperand');

		return Number(leftOperand) <= Number(rightOperand);
	}

	/**
	 * Returns a string representation of the LessEqualThan operator.
	 * @returns {string} The string representation of the LessEqualThan operator.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
