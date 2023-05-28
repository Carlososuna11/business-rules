import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetUnion<T> implements IOperator<Set<T>> {
	symbol = '|';
	id = 'setUnion';

	sets: (Set<T> | ICommand<Set<T>>)[];

	constructor(...sets: (Set<T> | ICommand<Set<T>>)[]) {
		this.sets = sets;
	}

	execute(): Set<T> {
		const setArray = this.sets.map((set) => (isCommand(set) ? set.execute() : set));
		return setArray.reduce((acc, set) => {
			set.forEach((value) => {
				acc.add(value);
			});
			return acc;
		}, new Set<T>());
	}
}
