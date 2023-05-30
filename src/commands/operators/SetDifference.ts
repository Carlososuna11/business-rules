import AbstactContextData from '../../context/AbstractContextData';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetDifference implements IOperator<Set<unknown>> {
	id = 'setDifference';
	symbol = '∖';

	constructor(private readonly sets: (Set<unknown> | ICommand<Set<unknown>>)[]) {}

	async execute(context: AbstactContextData): Promise<Set<unknown>> {
		const firstSet = isCommand(this.sets[0]) ? await this.sets[0].execute(context) : this.sets[0];
		const remainingSets = await Promise.all(
			this.sets.slice(1).map(async (set) => (isCommand(set) ? await set.execute(context) : set))
		);

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
