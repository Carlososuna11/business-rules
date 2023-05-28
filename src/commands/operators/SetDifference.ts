import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class SetDifference implements IOperator<Set<any>> {
	id = 'setDifference';
	symbol = '∖';

	sets: (Set<any> | ICommand<Set<any>>)[];
	constructor(...sets: (Set<any> | ICommand<Set<any>>)[]) {
		this.sets = sets;
	}

	execute(): Set<any> {
		const firstSet = isCommand(this.sets[0]) ? this.sets[0].execute() : this.sets[0];
		const remainingSets = this.sets.slice(1).map((set) => (isCommand(set) ? set.execute() : set));

		return remainingSets.reduce((result, set) => {
			return new Set([...result].filter((value) => !set.has(value)));
		}, firstSet);
	}
}
