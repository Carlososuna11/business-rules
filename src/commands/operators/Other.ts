import { registerOperator } from '.';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

@registerOperator('other')
export default class Other<T> implements IOperator<boolean> {
	id = 'other';
	symbol = '!=';

	values: (T | ICommand<T> | boolean)[];

	constructor(...values: (T | ICommand<T> | boolean)[]) {
		this.values = values;
	}

	execute(): boolean {
		return (
			this.values.reduce((prev, curr) => {
				let previous = isCommand(prev) ? prev.execute() : prev;
				let current = isCommand(curr) ? curr.execute() : curr;

				return previous !== current;
			}) != false
		);
	}
}
