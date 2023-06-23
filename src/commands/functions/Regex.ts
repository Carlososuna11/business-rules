/**
 * Represents a Regex function that checks whether a given regex matches a given string value.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';
export default class Regex implements IFunction<boolean> {
	/**
	 * Creates a new instance of the Regex function.
	 * @param value - A string or a command that returns a string representing the value to be tested against the regex.
	 * @param regex - A string or a command that returns a string representing the regex to be tested against the value.
	 */
	constructor(private readonly value: ICommand<string> | string, private readonly regex: ICommand<string> | string) {}

	/**
	 * The unique identifier of the function.
	 */
	id = 'regex';

	/**
	 * A type guard used for validating the input arguments of the function.
	 */
	typeGuard: TypeGuard = new TypeGuard(['string']);

	/**
	 * Validates whether the given value matches the expected type.
	 * @param value - The value to be validated.
	 * @param operandName - The name of the operand being validated.
	 */
	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * The main execution logic of the function.
	 * @param context - The context data used for executing any commands used in the function.
	 * @returns A boolean value representing whether the given regex matches the given value.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const stringValue = isCommand(this.value) ? await this.value.execute(context) : this.value;
		const regexValue = isCommand(this.regex) ? await this.regex.execute(context) : this.regex;

		await this.validateValue(stringValue, 'value');
		await this.validateValue(regexValue, 'regex');

		const regex = new RegExp(regexValue);

		return regex.test(stringValue);
	}

	/**
	 * Returns a string representation of the function call.
	 * @returns A string representing the function call with its arguments.
	 */
	toString(): string {
		return `${this.id}(${this.value.toString()}, ${this.regex.toString()})`;
	}
}
