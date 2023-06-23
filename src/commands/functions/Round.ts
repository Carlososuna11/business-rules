/**
 * Represents a Round function that can be executed on numeric or string values.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

/**
 * Defines the structure and behavior of a Round function that can be executed on numeric or string values.
 */
export default class Round implements IFunction<number> {
	/**
	 * The unique identifier of the Round function.
	 */
	id = 'round';

	/**
	 * The type guard used to validate the input types of the Round function.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * Initializes a new instance of the Round function with the specified input value.
	 * @param value The numeric or string value to be rounded.
	 */
	constructor(private readonly value: ICommand<number | string> | number | string) {}

	/**
	 * Validates the input value to ensure it is either a number or a string representing a number.
	 * @param value The value to be validated.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Round function on the input value and returns the result.
	 * @param context The context data for the function execution.
	 * @returns The rounded numeric value.
	 * @throws {ValueException} If the input value is not a valid number or string representing a number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		if (isNaN(Number(transformedValue))) {
			throw new ValueException(`On ${this.id}. Value must be a number or a string representing a number`);
		}
		return Math.round(Number(transformedValue));
	}

	/**
	 * Returns a string representation of the Round function.
	 */
	toString(): string {
		return `${this.id}(${isCommand(this.value) ? this.value.toString() : String(this.value)})`;
	}
}
