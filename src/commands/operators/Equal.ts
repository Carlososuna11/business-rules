import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Equal<T> implements IOperator<boolean> {
	symbol = '==';
	id = 'equal';
	values: (T | ICommand<T> | boolean)[];

	constructor(...values: (T | ICommand<T> | boolean)[]) {
		this.values = values;
	}

	execute(): boolean {
		return (
			this.values.reduce((prev, curr) => {
				const previous = isCommand(prev) ? prev.execute() : prev;
				const current = isCommand(curr) ? curr.execute() : curr;

				return previous === current;
			}) != false
		);
	}
}
