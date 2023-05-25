import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Max<T extends number | string | Date> implements IFunction<T> {
	id = 'max';
	constructor(private readonly values: T[]) {}

	execute(): T {
		return Math.max(Number(...this.values)) as T;
	}
}
