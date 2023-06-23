/**
 * A class that implements the IFunction interface for converting a string to uppercase.
 */
import IFunction from './IFunction';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class Upper implements IFunction<string> {
	/**
	 * The unique identifier of the Upper function.
	 */
	id = 'upper';

	/**
	 * The type guard instance used for type checking.
	 */
	typeGuard: TypeGuard = new TypeGuard(['string']);

	/**
	 * Creates an instance of Upper.
	 * @param {ICommand<string> | string} value - The value to be converted to uppercase.
	 */
	constructor(private readonly value: ICommand<string> | string) {}

	/**
	 * Validates that the given value is a string.
	 * @param {string} value - The value to be validated.
	 * @param {string} operandName - The name of the operand being validated.
	 */
	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Upper function to convert the value to uppercase.
	 * @param {AbstractContextData} context - The context data to execute the function.
	 * @returns {string} - The value transformed to uppercase.
	 */
	async execute(context: AbstractContextData): Promise<string> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		return transformedValue.toUpperCase();
	}

	/**
	 * Returns a string representation of the Upper function.
	 * @returns {string} - The string representation of the Upper function.
	 */
	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
