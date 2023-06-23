/**
 * Class representing a between operator that checks if a value is between a minimum and maximum value.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Between implements IOperator<boolean> {
	/**
	 * The symbol used to represent the between operator.
	 */
	symbol = 'between';

	/**
	 * The ID of the between operator.
	 */
	id = 'between';

	/**
	 * The type guard instance used to validate the types of values.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string', 'date']);

	/**
	 * The value to check if it is between the minimum and maximum value.
	 */
	value: number | string | Date | ICommand<number | string | Date>;

	/**
	 * The minimum value of the range.
	 */
	minValue: number | string | Date | ICommand<number | string | Date>;

	/**
	 * The maximum value of the range.
	 */
	maxValue: number | string | Date | ICommand<number | string | Date>;

	/**
	 * Create a between operator instance.
	 * @param value - The value to check if it is between the minimum and maximum value.
	 * @param minValue - The minimum value of the range.
	 * @param maxValue - The maximum value of the range.
	 */
	constructor(
		value: number | string | Date | ICommand<number | string | Date>,
		minValue: number | string | Date | ICommand<number | string | Date>,
		maxValue: number | string | Date | ICommand<number | string | Date>
	) {
		this.value = value;
		this.minValue = minValue;
		this.maxValue = maxValue;
	}

	/**
	 * Validate the type of a value.
	 * @param value - The value to validate.
	 * @param operandName - The name of the operand being validated.
	 */
	private async validateValue(value: number | string | Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Execute the between operator to check if the value is between the minimum and maximum value.
	 * @param context - The abstract context data instance.
	 * @returns A boolean indicating if the value is between the minimum and maximum value.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const val = isCommand(this.value) ? await this.value.execute(context) : this.value;
		await this.validateValue(val, 'value');

		const min = isCommand(this.minValue) ? await this.minValue.execute(context) : this.minValue;
		await this.validateValue(min, 'minValue');

		const max = isCommand(this.maxValue) ? await this.maxValue.execute(context) : this.maxValue;
		await this.validateValue(max, 'maxValue');

		return val >= min && val <= max;
	}

	/**
	 * Get a string representation of the between operator.
	 * @returns A string representation of the between operator.
	 */
	toString(): string {
		return `(${this.value.toString()} ${this.symbol} (${this.minValue.toString()} and ${this.maxValue.toString()}))`;
	}
}
