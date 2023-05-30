import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetIntersection implements IOperator<Set<unknown>> {
	symbol = '&';
	id = 'setIntersection';

	constructor(private readonly sets: (Set<unknown> | ICommand<Set<unknown>>)[]) {}

	async execute(context: AbstractContextData): Promise<Set<unknown>> {
		const setArray = await Promise.all(
			this.sets.map(async (set) => (isCommand(set) ? await set.execute(context) : set))
		);

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
