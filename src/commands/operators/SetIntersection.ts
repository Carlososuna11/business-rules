import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetIntersection implements IOperator<Set<unknown>> {
	symbol = '&';
	id = 'setIntersection';

	constructor(private readonly sets: (Set<unknown> | ICommand<Set<unknown>>)[]) {}

	execute(): Set<unknown> {
		const setArray = this.sets.map((set) => (isCommand(set) ? set.execute() : set));

		return setArray.reduce((accumulator, currentSet) => {
			return new Set([...accumulator].filter((element) => currentSet.has(element)));
		});
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
