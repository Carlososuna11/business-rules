import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetIntersection<T> implements IOperator<Set<T>> {
	symbol = '&';
	id = 'setIntersection';

	sets: (Set<T> | ICommand<Set<T>>)[];

	constructor(...sets: (Set<T> | ICommand<Set<T>>)[]) {
		this.sets = sets;
	}

	execute(): Set<T> {
		const setArray = this.sets.map((set) => (isCommand(set) ? set.execute() : set));

		return setArray.reduce((accumulator, currentSet) => {
			return new Set([...accumulator].filter((element) => currentSet.has(element)));
		});
	}
}
