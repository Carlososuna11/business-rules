/**
 * Class that represents the Contain operator, which checks if a value is contained in a list.
 */
import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Contain implements IOperator<boolean> {
	/**
	 * The symbol that represents the Contain operator.
	 */
	symbol = 'contain';

	/**
	 * The id that identifies the Contain operator.
	 */
	id = 'contain';

	/**
	 * The value to search for in the list.
	 */
	value: unknown | ICommand<unknown>;

	/**
	 * The list to search the value in.
	 */
	list: (unknown | ICommand<unknown>)[] | ICommand<unknown[]>;

	/**
	 * Creates a new instance of the Contain operator.
	 * @param value The value to search for in the list.
	 * @param list The list to search the value in.
	 */
	constructor(value: unknown | ICommand<unknown>, list: (unknown | ICommand<unknown>)[] | ICommand<unknown[]>) {
		this.value = value;
		this.list = list;
	}

	/**
	 * Executes the Contain operator, checking if the value is contained in the list.
	 * @param context The context to execute the operator under.
	 * @returns A boolean indicating if the value is contained in the list.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		let list: (unknown | ICommand<unknown>)[] = [];
		if (isCommand(this.list)) {
			list = (await this.list.execute(context)) as unknown[];
		}
		list = (await Promise.all(list.map(async (e) => (isCommand(e) ? await e.execute(context) : e)))) as unknown[];
		const value = isCommand(this.value) ? await this.value.execute(context) : this.value;
		return list.includes(value);
	}

	/**
	 * Returns a string representation of the Contain operator.
	 * @returns A string representation of the Contain operator.
	 */
	toString(): string {
		let listString = '';
		if (isCommand(this.list)) {
			listString = this.list.toString();
		} else {
			listString = this.list.map((e) => (isCommand(e) ? e.toString() : String(e))).join(', ');
			listString = `[${listString}]`;
		}
		const value = isCommand(this.value) ? this.value.toString() : String(this.value);
		return `${value} ${this.symbol} ${listString}`;
	}
}
