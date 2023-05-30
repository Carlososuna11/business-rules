/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Contain implements IOperator<boolean> {
	symbol = 'contain';
	id = 'contain';

	value: unknown | ICommand<unknown>;
	list: (unknown | ICommand<unknown>)[] | ICommand<unknown[]>;

	constructor(value: unknown | ICommand<unknown>, list: (unknown | ICommand<unknown>)[] | ICommand<unknown[]>) {
		this.value = value;
		this.list = list;
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		let list: (unknown | ICommand<unknown>)[] = [];
		if (isCommand(this.list)) {
			list = (await this.list.execute(context)) as unknown[];
		}

		list = (await Promise.all(list.map(async (e) => (isCommand(e) ? await e.execute(context) : e)))) as unknown[];

		const value = isCommand(this.value) ? await this.value.execute(context) : this.value;

		return list.includes(value);
	}

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
