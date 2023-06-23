/**
 * Represents the isNaN function that takes in a number or a string and returns true if the input is Not-A-Number (NaN).
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class IsNaN implements IFunction<boolean> {
	/**
	 * The id of the isNaN function.
	 */
	id = 'isNaN';

	/**
	 * The type guard object that checks if the input is of type 'number' or 'string'.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * Creates a new instance of the IsNaN function.
	 * @param value The value that will be checked if it is NaN.
	 */
	constructor(private readonly value: ICommand<string | number> | string | number) {}

	/**
	 * Validates that the input value is either a number or a string.
	 * @param value The value to be validated.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the isNaN function and returns true if the input value is NaN.
	 * @param context The context data object.
	 * @returns A boolean indicating whether the input value is NaN.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		return isNaN(Number(transformedValue));
	}

	/**
	 * Returns the string representation of the isNaN function.
	 * @returns A string representation of the isNaN function.
	 */
	toString(): string {
		return `${this.id}(${isCommand(this.value) ? this.value.toString() : String(this.value)})`;
	}
}
