import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Length implements IFunction<number> {
	id = 'length';
	constructor(private readonly values: (ICommand<unknown> | unknown)[]) {}

	execute(): number {
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		return transformedValues.length;
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
