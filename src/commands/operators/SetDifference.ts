import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetDifference implements IOperator<Set<unknown>> {
	id = 'setDifference';
	symbol = '∖';

	constructor(private readonly sets: (Set<unknown> | ICommand<Set<unknown>>)[]) {}

	execute(): Set<unknown> {
		const firstSet = isCommand(this.sets[0]) ? this.sets[0].execute() : this.sets[0];
		const remainingSets = this.sets.slice(1).map((set) => (isCommand(set) ? set.execute() : set));

		return remainingSets.reduce((result, set) => {
			return new Set([...result].filter((value) => !set.has(value)));
		}, firstSet);
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
