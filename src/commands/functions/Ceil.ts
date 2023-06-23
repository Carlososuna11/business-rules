/**
 * Represents the Ceil function that implements the IFunction interface.
 * Takes in a number or a string that represents a number and returns the smallest integer greater than or equal to the given number.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Ceil implements IFunction<number> {
	/**
	 * The id of the Ceil function.
	 */
	id = 'ceil';

	/**
	 * An instance of the TypeGuard class.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * Creates an instance of the Ceil function.
	 * @param value A number, a string that represents a number or an instance of a Command that evaluates to a number or string.
	 */
	constructor(private readonly value: ICommand<number | string> | number | string) {}

	/**
	 * Validates if the value is of type number or string.
	 * @param value The value to be validated.
	 * @param operandName The name of the operand to be validated.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Ceil function.
	 * @param context An instance of the AbstractContextData class.
	 * @returns A number that represents the smallest integer greater than or equal to the given value.
	 * @throws A ValueException if the given value is not a number or a string that represents a number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		if (isNaN(Number(transformedValue))) {
			throw new ValueException(`On ${this.id}. Value must be a number or a string representing a number`);
		}
		return Math.ceil(Number(transformedValue));
	}

	/**
	 * Returns a string representation of the Ceil function.
	 * @returns A string representation of the Ceil function.
	 */
	toString(): string {
		return `${this.id}(${isCommand(this.value) ? this.value.toString() : String(this.value)})`;
	}
}
