/**
 * Represents a function to get an element from a list
 * @template T - The type of elements in the list
 */
import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class GetElement<T> implements IFunction<T> {
	/**
	 * The identifier of the function
	 */
	id = 'getElement';

	/**
	 * The list of elements to retrieve the element from
	 */
	private readonly list: (ICommand<T> | T)[] | ICommand<T[]>;

	/**
	 * The index of the element to retrieve
	 */
	private readonly index: ICommand<number> | number;

	/**
	 * Creates a new instance of the GetElement class
	 * @param list - The list of elements to retrieve the element from
	 * @param index - The index of the element to retrieve
	 */
	constructor(list: (ICommand<T> | T)[] | ICommand<T[]>, index: number | ICommand<number>) {
		this.list = list;
		this.index = index;
	}

	/**
	 * Executes the GetElement function
	 * @param context - The context data
	 * @returns The retrieved element
	 */
	async execute(context: AbstractContextData): Promise<T> {
		const values = isCommand(this.list) ? await this.list.execute(context) : this.list;

		const results = await Promise.all(
			values.map(async (value) => {
				const toEvaluate = isCommand(value) ? await value.execute(context) : value;
				return toEvaluate;
			})
		).catch((err) => {
			throw err;
		});

		const index = isCommand(this.index) ? await this.index.execute(context) : this.index;

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return results[index];
	}

	/**
	 * Returns a string representation of the GetElement function
	 * @returns A string representation of the GetElement function
	 */
	toString(): string {
		const str = isCommand(this.list)
			? this.list.toString()
			: this.list.map((e) => (isCommand(e) ? e.toString() : e)).join(`, `);
		return `${this.id}(${str}, ${this.index.toString()})`;
	}
}
