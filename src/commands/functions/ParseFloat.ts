/**
 * This class represents a ParseFloat function that implements IFunction<number>.
 * It takes in a value of type ICommand<string> | string and returns a number.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand from '../ICommand';
import IFunction from './IFunction';

export default class ParseFloat implements IFunction<number> {
	/**
	 * The id of the function
	 */
	id = 'parseFloat';

	/**
	 * The typeGuard to evaluate the value
	 */
	typeGuard: TypeGuard = new TypeGuard(['string']);

	/**
	 * Creates a new instance of ParseFloat.
	 * @param value The value to parse as a float.
	 */
	constructor(private readonly value: ICommand<string> | string) {}

	/**
	 * Validates if the given value is a valid string to parse as a number.
	 * @param value The value to validate.
	 * @param operandName The name of the operand to validate.
	 */
	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the ParseFloat function and returns the parsed number.
	 * @param context The context to execute the function in.
	 * @returns The parsed number.
	 * @throws ValueException if the value is not a valid number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const stringValue = typeof this.value === 'string' ? this.value : await this.value.execute(context);

		await this.validateValue(stringValue, 'value');

		if (isNaN(Number(stringValue))) {
			throw new ValueException(`On ${this.id}. Value must be a string representing a number`);
		}

		return parseFloat(stringValue);
	}

	/**
	 * Returns a string representation of the ParseFloat function.
	 * @returns A string representation of the ParseFloat function.
	 */
	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
