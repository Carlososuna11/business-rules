import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

/**
 * Represents the MinDate function that implements the IFunction interface.
 * @template Date - Generic type parameter that represents the type of the date.
 * @implements {IFunction<Date>}
 */
export default class MinDate implements IFunction<Date> {
	/**
	 * The unique identifier of the function.
	 *
	 * @type {string}
	 */
	id = 'minDate';

	/**
	 * The type guard used to determine the type of the operand.
	 *
	 * @type {TypeGuard}
	 */
	typeGuard: TypeGuard = new TypeGuard(['date']);

	/**
	 * The values to be used in the function.
	 *
	 * @private
	 * @type {Array<(ICommand<Date> | Date)> | ICommand<Date[]> | ICommand<Date>}
	 */
	private readonly values: (ICommand<Date> | Date)[] | ICommand<Date[]> | ICommand<Date>;

	/**
	 * Creates an instance of MinDate.
	 * @param {...(ICommand<Date> | Date)[]} values - An array of ICommand<Date> or Date values.
	 * @memberof MinDate
	 */
	constructor(...values: (ICommand<Date> | Date)[]);

	/**
	 * Creates an instance of MinDate.
	 * @param {(ICommand<Date[]> | ICommand<Date> | Date)} values - An ICommand<Date[]> or ICommand<Date> or Date value.
	 * @memberof MinDate
	 */
	constructor(values: ICommand<Date[]> | ICommand<Date> | Date);

	/**
	 * Creates an instance of MinDate.
	 * @param {...unknown[]} args - An array of unknown values.
	 * @memberof MinDate
	 */
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.values = isCommand(args[0]) ? (args[0] as ICommand<Date[]> | ICommand<Date>) : (args as Date[]);
		} else {
			this.values = args as (ICommand<Date> | Date)[];
		}
	}

	/**
	 * Validates whether the given value is of type Date.
	 *
	 * @private
	 * @param {Date} value - The value to be validated.
	 * @param {string} operandName - The name of the operand being validated.
	 * @returns {Promise<void>}
	 */
	private async validateValue(value: Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the MinDate function by finding the minimum date value in the array of values.
	 *
	 * @param {AbstractContextData} context - The context used in the execution.
	 * @returns {Promise<Date>}
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

			return new Date(Math.min(...result));
		}

		await this.validateValue(values, 'values');

		return values;
	}

	/**
	 * Returns a string representation of the MinDate function.
	 *
	 * @returns {string}
	 */
	toString(): string {
		const str = isCommand(this.values) ? this.values.toString() : this.values.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
