/**
 * A class that implements the IFunction interface to convert a boolean value to a number.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class BoolToNumber implements IFunction<number> {
	/**
	 * The id of the function.
	 */
	id = 'boolToNumber';

	/**
	 * The typeguard used to check the type of the value.
	 */
	typeGuard: TypeGuard = new TypeGuard(['boolean']);

	/**
	 * Creates an instance of BoolToNumber.
	 * @param value The value to be converted to a number.
	 */
	constructor(private readonly value: ICommand<boolean> | boolean) {}

	/**
	 * Validates the value to be converted to a number.
	 * @param value The value to be validated.
	 * @param operandName The name of the operand to be validated.
	 */
	private async validateValue(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the conversion from boolean to number.
	 * @param context The context in which the conversion is being performed.
	 * @returns The number resulting from the conversion.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		return transformedValue ? 1 : 0;
	}

	/**
	 * Returns a string representation of the function.
	 * @returns A string representation of the function.
	 */
	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
