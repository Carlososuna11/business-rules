import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Min<T extends number | string | Date> implements IFunction<T> {
	id = 'min';
	constructor(private readonly values: T[]) {}

	execute(): T {
		return Math.min(Number(...this.values)) as T;
	}
}
