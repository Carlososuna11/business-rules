/**
 * Represents the not equal operator (!=) used to compare two values.
 * @implements {IOperator<boolean>}
 */
import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class NotEqual implements IOperator<boolean> {
	/**
	 * The symbol used to represent the not equal operator.
	 */
	symbol = '!=';
	/**
	 * The id of the not equal operator.
	 */
	id = 'notEqual';

	/**
	 * The left operand used in the comparison.
	 */
	left: unknown | ICommand<unknown>;
	/**
	 * The right operand used in the comparison.
	 */
	right: unknown | ICommand<unknown>;

	/**
	 * Creates a new instance of the not equal operator.
	 * @param {unknown | ICommand<unknown>} left The left operand used in the comparison.
	 * @param {unknown | ICommand<unknown>} right The right operand used in the comparison.
	 */
	constructor(left: unknown | ICommand<unknown>, right: unknown | ICommand<unknown>) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Executes the not equal operator and returns the result.
	 * @param {AbstractContextData} context The context used for execution.
	 * @returns {Promise<boolean>} The result of the not equal comparison.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;

		return leftOperand !== rightOperand;
	}

	/**
	 * Returns the string representation of the not equal operator.
	 * @returns {string} The string representation of the not equal operator.
	 */
	toString(): string {
		return `${isCommand(this.left) ? this.left.toString() : this.left} ${this.symbol} ${
			isCommand(this.right) ? this.right.toString() : this.right
		}`;
	}
}
