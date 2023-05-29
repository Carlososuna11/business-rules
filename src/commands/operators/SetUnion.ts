import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetUnion implements IOperator<Set<unknown>> {
	symbol = '|';
	id = 'setUnion';

	constructor(private readonly sets: (Set<unknown> | ICommand<Set<unknown>>)[]) {}

	execute(): Set<unknown> {
		const setArray = this.sets.map((set) => (isCommand(set) ? set.execute() : set));
		return setArray.reduce((acc, set) => {
			set.forEach((value) => {
				acc.add(value);
			});
			return acc;
		}, new Set<unknown>());
	}

	toString(): string {
		const str = this.sets
			.map((set) => {
				return isCommand(set) ? set.toString() : JSON.stringify([...set]);
			})
			.join(` ${this.symbol} `);
		return `(${str})`;
	}
}
