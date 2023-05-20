/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerOperator } from '.';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

@registerOperator('contains')
export default class Contains implements IOperator<boolean> {
	symbol = 'in';
	id = 'contains';

	collection: unknown[] | ICommand<unknown>[];
	value: ICommand<unknown> | unknown;

	constructor(collection: unknown[] | ICommand<unknown>[], value: ICommand<unknown> | unknown) {
		this.collection = collection;
		this.value = value;
	}
	execute(): boolean {

		let value = isCommand(this.value) ? this.value.execute() : this.value;

		// return this.collection.includes(value);

		return true;
	}
}

//TODO: Add operator.execute
