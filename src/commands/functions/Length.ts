import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';
/**
 * Represents a function that returns the length of an array of values or the length of a single value.
 */
export default class Length implements IFunction<number> {
	/** The unique identifier of this function. */
	id = 'length';

	/**
	 * The value(s) to measure the length of.
	 * If an array of values is provided, the length of that array will be measured.
	 * If a single value is provided, the length will be 1.
	 */
	private readonly values: (ICommand<unknown> | unknown)[] | ICommand<unknown[]> | ICommand<unknown>;

	/**
	 * Creates a new instance of the Length function.
	 *
	 * @param values - The value(s) to measure the length of.
	 * If an array of values is provided, the length of that array will be measured.
	 * If a single value is provided, the length will be 1.
	 */
	constructor(...values: (ICommand<unknown> | unknown)[]);

	/**
	 * Creates a new instance of the Length function.
	 *
	 * @param values - The value(s) to measure the length of.
	 * If an array of values is provided, the length of that array will be measured.
	 * If a single value is provided, the length will be 1.
	 */
	constructor(values: ICommand<unknown[]> | ICommand<unknown> | unknown);

	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.values = isCommand(args[0]) ? (args[0] as ICommand<unknown[] | unknown>) : (args as unknown[]);
		} else {
			this.values = args as (ICommand<unknown> | unknown)[];
		}
	}

	/**
	 * Executes the Length function and returns the length of the provided value(s).
	 *
	 * @param context - The context data used for execution.
	 * @returns The length of the provided value(s).
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const values = isCommand(this.values) ? await this.values.execute(context) : this.values;

		if (Array.isArray(values)) {
			const transformedValues = await Promise.all(
				values.map(async (value) => (isCommand(value) ? await value.execute(context) : value))
			);
			return transformedValues.length;
		}

		return 1;
	}

	/**
	 * Returns a string representation of the Length function.
	 *
	 * @returns A string representation of the Length function.
	 */
	toString(): string {
		const str = isCommand(this.values)
			? this.values.toString()
			: this.values.map((e) => (isCommand(e) ? e.toString() : String(e))).join(`, `);
		return `${this.id}(${str})`;
	}
}
