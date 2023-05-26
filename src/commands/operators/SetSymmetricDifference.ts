import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetSymmetricDifference<T> implements IOperator<Set<T>> {
	id = 'setSymmetricDifference';
	symbol = '∆';

	sets: (Set<T> | ICommand<Set<T>>)[];

	constructor(...sets: (Set<T> | ICommand<Set<T>>)[]) {
		this.sets = sets;
	}

	execute(): Set<T> {
		const result: Set<T> = new Set();
		const allValues: Set<T> = new Set();

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
