import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand from '../ICommand';
import IFunction from './IFunction';

/**
 * Implementation of the IFunction interface for parsing a string to a number using parseInt.
 * @implements {IFunction<number>}
 */
export default class ParseInt implements IFunction<number> {
	/**
	 * The unique identifier of the function.
	 * @type {string}
	 */
	id = 'parseInt';

	/**
	 * A TypeGuard instance to validate the operand types.
	 * @type {TypeGuard}
	 */
	typeGuard: TypeGuard = new TypeGuard(['string']);

	/**
	 * Creates an instance of ParseInt.
	 * @param {(ICommand<string> | string)} private readonly value The value to parse.
	 */
	constructor(private readonly value: ICommand<string> | string) {}

	/**
	 * Validates that the value operand is a string.
	 * @param {string} value The value operand to validate.
	 * @param {string} operandName The name of the operand being validated.
	 * @returns {Promise<void>} A promise that resolves if the operand is a string, and rejects if it's not.
	 */
	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the function to parse a string value to a number using parseInt.
	 * @param {AbstractContextData} context The context data for the execution.
	 * @returns {Promise<number>} A promise that resolves with the parsed integer value or rejects with a ValueException if the value is not a string representing a number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const stringValue = typeof this.value === 'string' ? this.value : await this.value.execute(context);

		await this.validateValue(stringValue, 'value');

		if (isNaN(Number(stringValue))) {
			throw new ValueException(`On ${this.id}. Value must be a string representing a number`);
		}

		return parseInt(stringValue);
	}

	/**
	 * Returns a string representation of the function call.
	 * @returns {string} A string representation of the function call.
	 */
	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
