/**
 * Represents a function that applies the Math.floor operation to a number or a string value.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Floor implements IFunction<number> {
	/**
	 * The id of the Floor function.
	 */
	id = 'floor';

	/**
	 * The typeGuard used to determine if the input value is a number or a string.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * Creates an instance of the Floor function.
	 * @param value The value to apply the Math.floor operation to, as a number, a string or a command that resolves to a number or a string.
	 */
	constructor(private readonly value: ICommand<number | string> | number | string) {}

	/**
	 * Validates that the value is a number or a string.
	 * @param value The value to validate.
	 * @param operandName The name of the value being validated.
	 * @returns A Promise that resolves when the validation is complete.
	 * @throws {ValueException} When the value is not a number or a string.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Floor function and returns the result as a number.
	 * @param context The context data to use for command resolution.
	 * @returns The result of the Math.floor operation as a number.
	 * @throws {ValueException} When the input value is not a number or a string representing a number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		if (isNaN(Number(transformedValue))) {
			throw new ValueException(`On ${this.id}. Value must be a number or a string representing a number`);
		}
		return Math.floor(Number(transformedValue));
	}

	/**
	 * Returns a string representation of the Floor function.
	 * @returns A string representation of the Floor function.
	 */
	toString(): string {
		return `${this.id}(${isCommand(this.value) ? this.value.toString() : String(this.value)})`;
	}
}
