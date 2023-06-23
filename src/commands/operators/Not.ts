import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

/**
 * Represents the boolean NOT operator.
 * @implements {IOperator<boolean>}
 */
export default class Not implements IOperator<boolean> {
	/**
	 * The symbol of the operator.
	 * @type {string}
	 */
	symbol = '!';

	/**
	 * The ID of the operator.
	 * @type {string}
	 */
	id = 'not';

	/**
	 * The TypeGuard used to validate the operand.
	 * @type {TypeGuard}
	 */
	private typeGuard = new TypeGuard(['boolean']);

	/**
	 * Creates an instance of Not.
	 * @param {(boolean | ICommand<boolean>)} operand - The operand of the operator.
	 */
	constructor(public operand: boolean | ICommand<boolean>) {}

	/**
	 * Validates that the given value is a boolean.
	 * @param {boolean} value - The value to validate.
	 * @param {string} operandName - The name of the operand.
	 * @returns {Promise<void>} - Resolves if the value is valid, rejects otherwise.
	 */
	private async validateValue(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the operator and returns the result.
	 * @param {AbstractContextData} context - The context in which to execute the operator.
	 * @returns {Promise<boolean>} - The result of the execution.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const operand = isCommand(this.operand) ? await this.operand.execute(context) : this.operand;
		await this.validateValue(operand, 'operand');

		return !operand;
	}

	/**
	 * Returns the string representation of the operator.
	 * @returns {string} - The string representation of the operator.
	 */
	public toString(): string {
		return `${this.symbol}(${this.operand.toString()})`;
	}
}
