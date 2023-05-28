import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetSymmetricDifference implements IOperator<Set<unknown>> {
	id = 'setSymmetricDifference';
	symbol = '∆';

	sets: (Set<unknown> | ICommand<Set<unknown>>)[];

	constructor(...sets: (Set<unknown> | ICommand<Set<unknown>>)[]) {
		this.sets = sets;
	}

	execute(): Set<unknown> {
		const result: Set<unknown> = new Set();
		const allValues: Set<unknown> = new Set();

		for (const set of this.sets) {
			const values = isCommand(set) ? set.execute() : set;

			for (const value of values) {
				if (allValues.has(value)) {
					result.delete(value);
				} else {
					result.add(value);
				}
				allValues.add(value);
			}
		}

		return result;
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
