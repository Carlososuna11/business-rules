/**
 * Represents a Trunc function that implements IFunction<number> interface
 * @implements {IFunction<number>}
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Trunc implements IFunction<number> {
	/**
	 * The ID of the Trunc function
	 * @type {string}
	 */
	id = 'trunc';

	/**
	 * An instance of the TypeGuard to evaluate the type of values used in the function
	 * @type {TypeGuard}
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * The value to be truncated or a command to retrieve the value
	 * @type {ICommand<number | string> | number | string}
	 * @private
	 */
	constructor(private readonly value: ICommand<number | string> | number | string) {}

	/**
	 * Validates if a given value is a number or a string representing a number
	 * @param {number|string} value - The value to be validated
	 * @param {string} operandName - The name of the operand to be validated
	 * @returns {Promise<void>} - A Promise that resolves when the validation is successful and rejects with a ValueException if the validation fails
	 * @private
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Truncates a number or a string representing a number
	 * @param {AbstractContextData} context - The context data for the execution of the command
	 * @returns {Promise<number>} - A Promise that resolves with the truncated number and rejects with a ValueException if the value is not a valid number or a string representing a number
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		if (isNaN(Number(transformedValue))) {
			throw new ValueException(`On ${this.id}. Value must be a number or a string representing a number`);
		}
		return Math.trunc(Number(transformedValue));
	}

	/**
	 * Returns the string representation of the Trunc function
	 * @returns {string} - The string representation of the Trunc function
	 */
	toString(): string {
		return `${this.id}(${isCommand(this.value) ? this.value.toString() : String(this.value)})`;
	}
}
