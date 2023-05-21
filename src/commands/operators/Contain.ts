/* eslint-disable @typescript-eslint/no-explicit-any */
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Contain<T> implements IOperator<boolean> {
	symbol = 'contain';
	id = 'contain';

	value: T | ICommand<T>;
	list: T[] | ICommand<T[]>;

	constructor(value: T | ICommand<T>, list: T[] | ICommand<T[]>) {
		this.value = value;
		this.list = list;
	}

	execute(): boolean {
		const list = isCommand(this.list) ? this.list.execute() : this.list;
		const value = isCommand(this.value) ? this.value.execute() : this.value;

		return list.includes(value);
	}
}
