import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

/**
 * Represents a function that returns the maximum value of an array of dates or a single date.
 * @implements {IFunction}
 */
export default class MaxDate implements IFunction<Date> {
	/**
	 * The unique identifier of the function.
	 */
	id = 'maxDate';

	/**
	 * The type guard used to validate the function arguments.
	 */
	typeGuard: TypeGuard = new TypeGuard(['date']);

	/**
	 * The values that will be used to compute the maximum date.
	 * It can be an array of dates or commands that return an array of dates.
	 * It can also be a single date or a command that return a single date.
	 */
	private readonly values: (ICommand<Date> | Date)[] | ICommand<Date[]> | ICommand<Date>;

	/**
	 * Creates an instance of MaxDate.
	 * @param {ICommand<Date[]> | ICommand<Date> | Date | ICommand<Date>[] | Date[]} values - The values that will be used to compute the maximum date.
	 */
	constructor(...values: (ICommand<Date> | Date)[]);
	constructor(values: ICommand<Date[]> | ICommand<Date> | Date);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.values = isCommand(args[0]) ? (args[0] as ICommand<Date[]> | ICommand<Date>) : (args as Date[]);
		} else {
			this.values = args as (ICommand<Date> | Date)[];
		}
	}

	/**
	 * Validates a date value against the specified type guard.
	 * @param {Date} value - The date value to be validated.
	 * @param {string} operandName - The name of the operand to be validated.
	 * @returns {Promise<void>}
	 */
	private async validateValue(value: Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the function with the given context and returns the maximum date.
	 * @param {AbstractContextData} context - The context used to execute the commands.
	 * @returns {Promise<Date>} The maximum date.
	 * @throws {Error} If an error occurs while executing the commands or validating the arguments.
	 */
	async execute(context: AbstractContextData): Promise<Date> {
		const values = isCommand(this.values) ? await this.values.execute(context) : this.values;

		if (Array.isArray(values)) {
			const result = await Promise.all(
				values.map(async (value, index) => {
					const toEvaluate = isCommand(value) ? await value.execute(context) : value;
					await this.validateValue(toEvaluate, `values[${index}]`);
					return toEvaluate.getTime();
				})
			).catch((err) => {
				throw err;
			});

			return new Date(Math.max(...result));
		}

		await this.validateValue(values, 'values');

		return values;
	}

	/**
	 * Returns a string representation of the function.
	 * @returns {string} A string representation of the function.
	 */
	toString(): string {
		const str = isCommand(this.values) ? this.values.toString() : this.values.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
