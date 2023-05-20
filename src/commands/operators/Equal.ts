import { registerOperator } from '.';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

@registerOperator('equal')
export default class Equal<T> implements IOperator<boolean> {
	values: (T | ICommand<T> | boolean)[];

	constructor(...values: (T | ICommand<T> | boolean)[]) {
		this.values = values;
	}
	symbol = '==';
	id = 'equal';

	execute(): boolean {
		return this.values.reduce((prev, curr) => {
			let previous = isCommand(prev) ? prev.execute() : prev;
			let current = isCommand(curr) ? curr.execute() : curr;

			return previous === current;

		}) != false;
	}
}
