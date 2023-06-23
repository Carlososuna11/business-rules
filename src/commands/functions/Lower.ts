/**
 * Represents the Lower function which implements IFunction<string> interface.
 * This function takes a string operand and returns its lowercase form.
 */
import IFunction from './IFunction';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class Lower implements IFunction<string> {
	/**
	 * The identifier of the Lower function.
	 */
	id = 'lower';

	/**
	 * The TypeGuard instance to evaluate the type of the operand.
	 */
	typeGuard: TypeGuard = new TypeGuard(['string']);

	/**
	 * Creates a new instance of Lower function.
	 * @param value A ICommand<string> or string operand.
	 */
	constructor(private readonly value: ICommand<string> | string) {}

	/**
	 * Validates if the given value is a string or not.
	 * @param value The value to be validated.
	 * @param operandName The name of the operand.
	 */
	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Lower function and returns the lowercase form of the string operand.
	 * @param context The context data.
	 * @returns The transformed string.
	 */
	async execute(context: AbstractContextData): Promise<string> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		return transformedValue.toLowerCase();
	}

	/**
	 * Returns the string representation of the Lower function.
	 * @returns The string representation of the Lower function.
	 */
	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
