/**
 * Represents a function that calculates the number of years from a given date up to the current date.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class YearsFromNow implements IFunction<number> {
	/**
	 * The unique identifier of the function.
	 */
	id = 'yearsFromNow';

	/**
	 * A TypeGuard instance used for type checking.
	 */
	typeGuard: TypeGuard = new TypeGuard(['date', 'string']);

	/**
	 * Initializes a new instance of the YearsFromNow class.
	 * @param date - A ICommand instance or a Date object representing the date to calculate the years from.
	 */
	constructor(private readonly date: ICommand<Date> | Date) {}

	/**
	 * Validates that the value passed in is a Date object or a string representation of a date.
	 * @param value - The value to validate.
	 * @param operandName - The name of the operand to validate.
	 */
	private async validateValue(value: Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the function and calculates the number of years from the given date up to the current date.
	 * @param context - The context data to execute the function with.
	 * @returns The number of years from the given date up to the current date.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		let evaluatedDate = isCommand(this.date) ? await this.date.execute(context) : this.date;

		await this.validateValue(evaluatedDate, 'date');

		if (typeof evaluatedDate === 'string') {
			evaluatedDate = new Date(evaluatedDate);
		}

		const today = new Date();

		const years = today.getFullYear() - evaluatedDate.getFullYear();
		const months = today.getMonth() - evaluatedDate.getMonth();
		const days = today.getDate() - evaluatedDate.getDate();

		if (months < 0 || (months === 0 && days < 0)) {
			return years - 1;
		} else {
			return years;
		}
	}

	/**
	 * Returns a string representation of the function.
	 * @returns A string representation of the function.
	 */
	toString(): string {
		return `${this.id}(${this.date.toString()})`;
	}
}
