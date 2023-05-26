import IFunction from './IFunction';
import ICommand from '../ICommand';

export default class Upper implements IFunction<string> {
	id = 'upper';
	constructor(private readonly value: ICommand<string> | string) {}

	execute(): string {
		return typeof this.value === 'string' ? this.value.toUpperCase() : this.value.execute().toUpperCase();
	}
}
