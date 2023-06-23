/**
 * Converts a number or string to a boolean value.
 * @implements {IFunction<boolean>}
 * @classdesc Class representing a ToBoolean function.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import { IFunction } from '.';

export default class ToBoolean implements IFunction<boolean> {
	id = 'toBoolean';

	private typeGuard: TypeGuard = new TypeGuard(['string', 'number']);

	/**
	 * The value to be converted to boolean.
	 * @type {number | string | ICommand<number | string>}
	 */
	value: number | string | ICommand<number | string>;

	/**
	 * Create a ToBoolean function.
	 * @param {number | string | ICommand<number | string>} value - The value to be converted to boolean.
	 */
	constructor(value: number | string | ICommand<number | string>) {
		this.value = value;
	}

	/**
	 * Validate the value to be converted.
	 * @param {number | string} value - The value to be validated.
	 * @param {string} operandName - The name of the operand to be validated.
	 * @returns {Promise<void>} - A promise that resolves if the value is valid or rejects with an error message if the value is invalid.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Execute the ToBoolean function.
	 * @param {AbstractContextData} context - The context data for the command execution.
	 * @returns {Promise<boolean>} - A promise that resolves with the boolean value of the input or rejects with an error message if the input is invalid.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const operand = isCommand(this.value) ? await this.value.execute(context) : this.value;
		await this.validateValue(operand, 'value');
		return !!operand;
	}

	/**
	 * Get the string representation of the ToBoolean function.
	 * @returns {string} - A string representation of the ToBoolean function.
	 */
	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
