/* eslint-disable @typescript-eslint/no-explicit-any */
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Contain<T> implements IOperator<boolean> {
	symbol = 'contain';
	id = 'contain';

	value: T | ICommand<T>;
	list: (T | ICommand<T>)[] | ICommand<T[]>;

	constructor(value: T | ICommand<T>, list: (T | ICommand<T>)[] | ICommand<T[]>) {
		this.value = value;
		this.list = list;
	}

	execute(): boolean {
		let list: T[] = [];
		if (isCommand(this.list)) {
			list = this.list.execute() as T[];
		}
		list = list.map((e) => (isCommand(e) ? e.execute() : e)) as T[];
		const value = isCommand(this.value) ? this.value.execute() : this.value;

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
